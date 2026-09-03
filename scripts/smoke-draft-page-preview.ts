/**
 * Runtime smoke test for the page preview data path (spec Phase 5 checklist:
 * "Smoke-test page preview in draft mode").
 *
 * The app's preview flow (src/app/(frontend)/[[...pages]]/page.tsx +
 * src/cms/data/action.ts getPageData) reads pages with `draft: true` while
 * draft mode is enabled. Drafts are DISABLED in the schema (spec item 6:
 * versions carry no `drafts: true`, so every doc is published), which means
 * the draft read must return the current published content — and, because the
 * draft branch bypasses unstable_cache, it must reflect the latest save
 * immediately (preview never serves a stale cached copy).
 *
 * Boots a throwaway Payload instance against a scratch DB (defaults to
 * mongodb://127.0.0.1:27017/page_preview_smoke) and mirrors the app's page
 * collection shape.
 * Run: bunx tsx scripts/smoke-draft-page-preview.ts
 * SMOKE_DB_URL overrides the scratch database. The scratch DB is dropped at
 * the start of every run, so repeated runs are idempotent.
 */
/* eslint-disable no-console -- scratch verification script */
import { buildConfig } from 'payload'
import { getPayload } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

const DB_URL =
  process.env.SMOKE_DB_URL || 'mongodb://127.0.0.1:27017/page_preview_smoke'

const config = buildConfig({
  secret: 'smoke-test-secret',
  db: mongooseAdapter({ url: DB_URL }),
  collections: [
    {
      slug: 'pages',
      // Mirrors the app: version history kept, drafts disabled.
      versions: { maxPerDoc: 25 },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
      ],
    },
  ],
})

const failures: string[] = []
const check = (label: string, cond: boolean, detail?: unknown) => {
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

const main = async () => {
  const mongoose = (await import('mongoose')).default
  await mongoose.connect(DB_URL)
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()

  const payload = await getPayload({ config })

  const readDraft = async (slug: string) =>
    (
      await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
        draft: true,
      })
    ).docs[0]

  // --- draft read returns the published doc (drafts disabled => same doc) ---
  const page = await payload.create({
    collection: 'pages',
    data: { title: 'Draft Smoke', slug: 'preview-target' },
  })
  check(
    'draft:true read returns the page',
    (await readDraft('preview-target'))?.id === page.id,
  )
  check(
    'draft:true read is not found for unknown slug',
    (await readDraft('nope')) === undefined,
  )

  // --- preview reflects the latest save (draft branch bypasses cache) ---
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { title: 'Draft Smoke Updated' },
  })
  const fresh = await readDraft('preview-target')
  check(
    'draft:true read reflects latest title after update',
    fresh?.title === 'Draft Smoke Updated',
    fresh?.title,
  )

  // --- cleanup ---
  await payload.delete({ collection: 'pages', id: page.id })

  console.log(
    failures.length === 0
      ? '\nALL CHECKS PASSED'
      : `\n${failures.length} CHECK(S) FAILED`,
  )
  process.exit(failures.length === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('Smoke run failed:', err)
  process.exit(1)
})
