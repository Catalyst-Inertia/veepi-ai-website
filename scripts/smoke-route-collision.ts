/**
 * DB-backed smoke test for the F-04 route policy (shared validators).
 *
 * Boots a throwaway Payload instance with the REAL pages + groups
 * collections (so the validators under test are the production ones from
 * src/payload/schema/collections/route-collision.ts) and asserts the
 * cross-collection collision rule for CREATE and RENAME in both directions:
 *   - page slug exists -> group prefix `/<slug>` rejected (create + rename)
 *   - group prefix exists -> page slug `<segment>` rejected (create + rename)
 *   - non-colliding values accepted (create + rename)
 *
 * The revalidation hooks attached to the real collections would call
 * next/cache outside a Next server; the invalidation recorder
 * (src/cms/revalidate/emit) is installed up front so the hooks capture
 * instead of throwing.
 *
 * Boots against SMOKE_DB_URL (default mongodb://127.0.0.1:27018/route_collision_smoke);
 * the scratch DB is dropped at the start of every run.
 * Run: bunx tsx --env-file=.env scripts/smoke-route-collision.ts
 */
/* eslint-disable no-console -- scratch verification script */
import { buildConfig } from 'payload'
import { getPayload } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { setInvalidationRecorder } from '../src/cms/revalidate/emit'
import { Groups } from '../src/payload/schema/collections/groups.collection'
import { Pages } from '../src/payload/schema/collections/pages.collection'
import { Posts } from '../src/payload/schema/collections/posts.collection'

const DB_URL =
  process.env.SMOKE_DB_URL || 'mongodb://127.0.0.1:27018/route_collision_smoke'

const config = buildConfig({
  secret: 'smoke-test-secret',
  db: mongooseAdapter({ url: DB_URL }),
  // The real collections pull in the full relationship closure (seoField ->
  // media, linkFields -> pages/posts, groups.posts join), so the scratch
  // config carries all three real collections plus a media stub.
  collections: [
    Pages,
    Groups,
    Posts,
    { slug: 'media', fields: [{ name: 'alt', type: 'text' }] },
  ],
})

const rand = Math.random().toString(36).slice(2, 8)

const failures: string[] = []
const check = (label: string, cond: boolean, detail?: unknown): void => {
  if (cond) {
    console.log(`  ok: ${label}`)
  } else {
    failures.push(label)
    console.log(
      `  FAIL: ${label}`,
      detail === undefined ? '' : JSON.stringify(detail),
    )
  }
}

const rejects = async (op: () => Promise<unknown>): Promise<boolean> => {
  try {
    await op()
    return false
  } catch {
    return true
  }
}

type LoosePayload = {
  create: (args: {
    collection: string
    data: Record<string, unknown>
  }) => Promise<{ id: string; slug?: unknown; prefix?: unknown }>
  update: (args: {
    collection: string
    id: string
    data: Record<string, unknown>
  }) => Promise<{ id: string; slug?: unknown; prefix?: unknown }>
  delete: (args: { collection: string; id: string }) => Promise<unknown>
}

const main = async (): Promise<void> => {
  const mongoose = (await import('mongoose')).default
  await mongoose.connect(DB_URL)
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()

  const payload = (await getPayload({ config })) as unknown as LoosePayload

  // Real collections carry the revalidation hooks; record their targets
  // instead of letting them call next/cache outside a server.
  setInvalidationRecorder({ paths: [], tags: [] })

  const pageSlug = `collide-page-${rand}`
  const groupPrefix = `/collide-group-${rand}`

  // CREATE directions
  const page = await payload.create({
    collection: 'pages',
    data: { title: 'Collision page', slug: pageSlug },
  })
  check(`page ${pageSlug} created`, true)

  const groupAgainstPage = await rejects(() =>
    payload.create({
      collection: 'groups',
      data: { name: 'X', prefix: `/${pageSlug}` },
    }),
  )
  check(
    `create group /${pageSlug} rejected while page ${pageSlug} exists`,
    groupAgainstPage,
  )

  const group = await payload.create({
    collection: 'groups',
    data: { name: 'Collision group', prefix: groupPrefix },
  })
  check(`group ${groupPrefix} created`, true)

  const pageAgainstGroup = await rejects(() =>
    payload.create({
      collection: 'pages',
      data: { title: 'X', slug: groupPrefix.slice(1) },
    }),
  )
  check(
    `create page ${groupPrefix.slice(1)} rejected while group ${groupPrefix} exists`,
    pageAgainstGroup,
  )

  // RENAME directions
  const renamePageToGroupSegment = await rejects(() =>
    payload.update({
      collection: 'pages',
      id: page.id,
      data: { slug: groupPrefix.slice(1) },
    }),
  )
  check(
    `rename page ${pageSlug} -> ${groupPrefix.slice(1)} rejected (group owns it)`,
    renamePageToGroupSegment,
  )

  const renameGroupToPageSlug = await rejects(() =>
    payload.update({
      collection: 'groups',
      id: group.id,
      data: { prefix: `/${pageSlug}` },
    }),
  )
  check(
    `rename group ${groupPrefix} -> /${pageSlug} rejected (page owns it)`,
    renameGroupToPageSlug,
  )

  // Acceptance: non-colliding renames and creates still work.
  const freePageSlug = `collide-free-page-${rand}`
  const renamedPage = await payload.update({
    collection: 'pages',
    id: page.id,
    data: { slug: freePageSlug },
  })
  check(
    `rename page -> ${freePageSlug} accepted`,
    renamedPage.slug === freePageSlug,
    renamedPage.slug,
  )

  const freePrefix = `/collide-free-group-${rand}`
  const renamedGroup = await payload.update({
    collection: 'groups',
    id: group.id,
    data: { prefix: freePrefix },
  })
  check(
    `rename group -> ${freePrefix} accepted`,
    renamedGroup.prefix === freePrefix,
    renamedGroup.prefix,
  )

  const control = await payload.create({
    collection: 'groups',
    data: { name: 'Free', prefix: `/collide-control-${rand}` },
  })
  check('non-colliding group create accepted', true)
  await payload.delete({ collection: 'groups', id: control.id })

  // Cleanup fixtures (rename + control-delete already covered most).
  await payload.delete({ collection: 'pages', id: page.id })
  await payload.delete({ collection: 'groups', id: group.id })

  setInvalidationRecorder(null)

  if (failures.length > 0) {
    console.error(
      `F-04 route-collision smoke FAILED: ${failures.length} check(s)`,
    )
    process.exit(1)
  }
  console.log('F-04 route-collision smoke: ALL CHECKS PASSED')
  process.exit(0)
}

main().catch((err: unknown) => {
  console.error('F-04 route-collision smoke crashed:', err)
  process.exit(1)
})
