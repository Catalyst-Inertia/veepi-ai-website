/**
 * Runtime smoke test for slug-rename revalidation (spec Phase 5 checklist:
 * "Smoke-test slug rename revalidation for pages, posts, and groups").
 *
 * The revalidation hooks (src/payload/hooks/revalidate.hook.ts) invalidate
 * BOTH the current and the previous route/tag when a slug or prefix changes,
 * using `previousDoc` from afterChange. next/cache primitives (revalidateTag/
 * revalidatePath) only work inside a Next server, so this smoke:
 *
 *   1. verifies the shared path/tag helpers the hooks call produce old + new
 *      values for renames (the invalidation contract),
 *   2. installs a recorder (src/cms/revalidate/emit) so the REAL hooks
 *      capture their invalidation targets instead of calling next/cache, then
 *      exercises page slug, post slug, and group prefix changes — asserting
 *      each rename records BOTH the old and the new path,
 *   3. asserts a Post cannot be moved to another Group after creation (F-08).
 *
 * Boots a throwaway Payload instance against a scratch DB (defaults to
 * mongodb://127.0.0.1:27017/slug_revalidation_smoke).
 * Run: bunx tsx scripts/smoke-slug-revalidation.ts
 * SMOKE_DB_URL overrides the scratch database. The scratch DB is dropped at
 * the start of every run, so repeated runs are idempotent.
 */
/* eslint-disable no-console -- scratch verification script */
import { buildConfig } from 'payload'
import { getPayload } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import {
  CACHE_TAGS,
  pagePublicPath,
  postPublicPath,
} from '../src/cms/data/tags'
import { setInvalidationRecorder } from '../src/cms/revalidate/emit'
import {
  revalidateGroup,
  revalidatePage,
  revalidatePost,
} from '../src/payload/hooks/revalidate.hook'
import { rejectPostGroupMove } from '../src/payload/schema/collections/posts.collection'

const DB_URL =
  process.env.SMOKE_DB_URL ||
  'mongodb://127.0.0.1:27017/slug_revalidation_smoke'

const config = buildConfig({
  secret: 'smoke-test-secret',
  db: mongooseAdapter({ url: DB_URL }),
  collections: [
    {
      slug: 'pages',
      hooks: { afterChange: [revalidatePage] },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
      ],
    },
    {
      slug: 'groups',
      hooks: { afterChange: [revalidateGroup] },
      fields: [{ name: 'prefix', type: 'text', required: true, unique: true }],
    },
    {
      slug: 'posts',
      hooks: {
        beforeChange: [rejectPostGroupMove],
        afterChange: [revalidatePost],
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        {
          name: 'group',
          type: 'relationship',
          relationTo: 'groups',
          required: true,
          // Mirrors production (posts.collection.ts): the selector is
          // read-only on edit; field access is the admin/REST/GraphQL
          // enforcement layer on top of the beforeChange hook.
          access: { update: () => false },
        },
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

// The scratch collections are not in the generated payload-types; cast at the
// boundary once and keep the rest of the script readable.
type LooseDoc = {
  id: string
  slug?: unknown
  prefix?: unknown
  group?: unknown
}
type LoosePayload = {
  create: (args: {
    collection: string
    data: Record<string, unknown>
  }) => Promise<LooseDoc>
  update: (args: {
    collection: string
    id: string
    data: Record<string, unknown>
    overrideAccess?: boolean
  }) => Promise<LooseDoc>
  find: (args: {
    collection: string
    where?: Record<string, unknown>
    limit?: number
    depth?: number
  }) => Promise<{ docs: LooseDoc[] }>
  delete: (args: { collection: string; id: string }) => Promise<unknown>
}
type InvalidationRecorder = { paths: string[]; tags: string[] }

const main = async () => {
  const mongoose = (await import('mongoose')).default
  await mongoose.connect(DB_URL)
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()

  const payload = (await getPayload({ config })) as unknown as LoosePayload

  // Swap in a fresh recorder before each save so the hooks capture their
  // invalidation targets instead of calling next/cache outside a server.
  const record = (): InvalidationRecorder => {
    const fresh: InvalidationRecorder = { paths: [], tags: [] }
    setInvalidationRecorder(fresh)
    return fresh
  }

  // --- 1. invalidation contract: old + new paths and tags are derivable ---
  check(
    'pagePublicPath for new slug',
    pagePublicPath({ slug: 'renamed-page' }) === '/renamed-page',
    pagePublicPath({ slug: 'renamed-page' }),
  )
  check(
    'pagePublicPath for old slug',
    pagePublicPath({ slug: 'old-page' }) === '/old-page',
    pagePublicPath({ slug: 'old-page' }),
  )
  check(
    'flagged homepage resolves to root',
    pagePublicPath({ slug: 'homepage', isHomepage: true }) === '/',
  )
  check(
    'unflagged page never maps to root via slug',
    pagePublicPath({ slug: 'homepage' }) === '/homepage',
    pagePublicPath({ slug: 'homepage' }),
  )
  check(
    'postPublicPath uses prefix + slug',
    postPublicPath('/projects', 'old-post') === '/projects/old-post',
  )
  check(
    'page tag differs across rename (old vs new)',
    CACHE_TAGS.page('old-page') !== CACHE_TAGS.page('renamed-page'),
    `${CACHE_TAGS.page('old-page')} / ${CACHE_TAGS.page('renamed-page')}`,
  )
  check(
    'post tag differs across rename',
    CACHE_TAGS.post('old-post') !== CACHE_TAGS.post('renamed-post'),
  )
  check(
    'group tag differs across prefix change',
    CACHE_TAGS.group('/projects') !== CACHE_TAGS.group('/work'),
    `${CACHE_TAGS.group('/projects')} / ${CACHE_TAGS.group('/work')}`,
  )

  // The hook invalidates previous + current; simulate the revalidatePageDoc
  // tag collection with the same helpers the hook uses.
  const oldSlug: string = 'old-page'
  const newSlug: string = 'renamed-page'
  const pageTags = new Set([
    CACHE_TAGS.page(newSlug),
    CACHE_TAGS.collection.pages,
    ...(oldSlug && oldSlug !== newSlug ? [CACHE_TAGS.page(oldSlug)] : []),
  ])
  check(
    'page rename invalidates BOTH old and new tags',
    pageTags.has(CACHE_TAGS.page('old-page')) &&
      pageTags.has(CACHE_TAGS.page('renamed-page')),
    Array.from(pageTags),
  )
  const pagePaths = new Set([
    pagePublicPath({ slug: newSlug }),
    ...(oldSlug && oldSlug !== newSlug
      ? [pagePublicPath({ slug: oldSlug })]
      : []),
  ])
  check(
    'page rename revalidates BOTH old and new paths',
    pagePaths.has('/old-page') && pagePaths.has('/renamed-page'),
    Array.from(pagePaths),
  )

  // --- 2. real hooks record old + new invalidation targets on renames ---
  record()
  const page = await payload.create({
    collection: 'pages',
    data: { title: 'Rename Me', slug: 'old-page' },
  })

  const pageRec = record()
  const updatedPage = await payload.update({
    collection: 'pages',
    id: page.id,
    data: { slug: 'renamed-page' },
  })
  check(
    'page slug rename saves with real revalidatePage hook attached',
    updatedPage.slug === 'renamed-page',
    updatedPage.slug,
  )
  check(
    'page rename records the new path',
    pageRec.paths.includes(pagePublicPath({ slug: 'renamed-page' })),
    pageRec.paths,
  )
  check(
    'page rename records the old path',
    pageRec.paths.includes(pagePublicPath({ slug: 'old-page' })),
    pageRec.paths,
  )
  console.log(
    '  page rename invalidation:',
    JSON.stringify({ paths: pageRec.paths, tags: pageRec.tags }),
  )

  record()
  const group = await payload.create({
    collection: 'groups',
    data: { prefix: '/projects' },
  })
  record()
  const post = await payload.create({
    collection: 'posts',
    data: { title: 'Post', slug: 'old-post', group: group.id },
  })

  const postRec = record()
  const updatedPost = await payload.update({
    collection: 'posts',
    id: post.id,
    data: { slug: 'renamed-post' },
  })
  check(
    'post slug rename saves with real revalidatePost hook attached',
    updatedPost.slug === 'renamed-post',
    updatedPost.slug,
  )
  check(
    'post rename records the new path',
    postRec.paths.includes(postPublicPath('/projects', 'renamed-post')),
    postRec.paths,
  )
  check(
    'post rename records the old path',
    postRec.paths.includes(postPublicPath('/projects', 'old-post')),
    postRec.paths,
  )
  console.log(
    '  post rename invalidation:',
    JSON.stringify({ paths: postRec.paths, tags: postRec.tags }),
  )

  // --- 3. F-08: a Post cannot move to another Group after creation ---
  record()
  const group2 = await payload.create({
    collection: 'groups',
    data: { prefix: '/work' },
  })
  let rejected = false
  let rejectionMessage = ''
  try {
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { group: group2.id },
    })
  } catch (err) {
    rejected = true
    rejectionMessage = err instanceof Error ? err.message : String(err)
  }
  check('post group move is rejected', rejected, rejectionMessage)
  check(
    'rejection message is exact',
    rejectionMessage ===
      'A Post cannot be moved to another Group after creation',
    rejectionMessage,
  )

  // --- 3b. F-08 access path: field-level access (access.update: false)
  // blocks group moves when access is enforced (overrideAccess: false).
  // Verified against Payload 3.87: the enforced update throws
  // "You are not allowed to perform this action." — the field is not
  // silently stripped. ---
  let accessRejected = false
  let accessMessage = ''
  try {
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { group: group2.id },
      overrideAccess: false,
    })
  } catch (err) {
    accessRejected = true
    accessMessage = err instanceof Error ? err.message : String(err)
  }
  check(
    'post group move rejected under enforced field access',
    accessRejected,
    accessMessage,
  )
  check(
    'access-path rejection comes from field access, not the beforeChange hook',
    accessRejected && !accessMessage.includes('cannot be moved'),
    accessMessage,
  )
  const postAfterAccess = await payload.find({
    collection: 'posts',
    where: { id: { equals: post.id } },
    limit: 1,
    depth: 0,
  })
  check(
    'group unchanged after access-enforced rejection',
    postAfterAccess.docs[0]?.group === group.id,
    postAfterAccess.docs[0]?.group,
  )

  // --- 4. group prefix rename revalidates old + new group and member paths ---
  // group2 already owns /work; rename the first group to a third, unused
  // prefix so the unique constraint does not collide.
  const renamedPrefix = '/projects-renamed'
  const groupRec = record()
  const renamedGroup = await payload.update({
    collection: 'groups',
    id: group.id,
    data: { prefix: renamedPrefix },
  })
  check(
    'group prefix rename saves with real revalidateGroup hook attached',
    renamedGroup.prefix === renamedPrefix,
    renamedGroup.prefix,
  )
  check(
    'group rename records the new group path',
    groupRec.paths.includes(renamedPrefix),
    groupRec.paths,
  )
  check(
    'group rename records the old group path',
    groupRec.paths.includes('/projects'),
    groupRec.paths,
  )
  check(
    'group rename records the old group tag',
    groupRec.tags.includes(CACHE_TAGS.group('/projects')),
    groupRec.tags,
  )
  check(
    'group rename revalidates the member post new path',
    groupRec.paths.includes(postPublicPath(renamedPrefix, 'renamed-post')),
    groupRec.paths,
  )
  check(
    'group rename revalidates the member post old path',
    groupRec.paths.includes(postPublicPath('/projects', 'renamed-post')),
    groupRec.paths,
  )
  console.log(
    '  group rename invalidation:',
    JSON.stringify({ paths: groupRec.paths, tags: groupRec.tags }),
  )

  // --- cleanup ---
  await payload.delete({ collection: 'posts', id: post.id })
  await payload.delete({ collection: 'groups', id: group.id })
  await payload.delete({ collection: 'groups', id: group2.id })
  await payload.delete({ collection: 'pages', id: page.id })

  setInvalidationRecorder(null)

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
