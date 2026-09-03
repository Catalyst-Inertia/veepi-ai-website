/* eslint-disable no-console -- F-04 route-policy smoke test */
/**
 * DB-backed smoke test for the F-04 route policy: page slugs and group
 * prefixes may not overlap (spec Phase 4).
 *
 * Boots the real Payload config against DATABASE_URL (same as scripts/seed.ts)
 * and proves both rejection directions with self-created fixtures:
 *   1. page slug `f04-page-<rand>` exists -> group prefix `/f04-page-<rand>`
 *      is rejected.
 *   2. group prefix `/f04-group-<rand>` exists -> page slug `f04-group-<rand>`
 *      is rejected.
 * Fixtures use random suffixes and are deleted in `finally`, so the script is
 * safe to re-run against a dev database.
 *
 * Run: bunx tsx --env-file=.env scripts/smoke-route-policy.ts
 */
import payload from 'payload'
import config from '../payload.config'

const rand = Math.random().toString(36).slice(2, 8)

const failures: string[] = []
const check = (label: string, cond: boolean, detail?: unknown): void => {
  if (cond) {
    console.log(`ok - ${label}`)
  } else {
    failures.push(label)
    console.log(`FAIL - ${label}`, detail ?? '')
  }
}

const rejectsWithValidationError = async (
  op: () => Promise<unknown>,
): Promise<boolean> => {
  try {
    await op()
    return false
  } catch {
    return true
  }
}

const main = async (): Promise<void> => {
  await payload.init({ config })

  const pageSlug = `f04-page-${rand}`
  const groupPrefix = `/f04-group-${rand}`
  let pageId: string | undefined
  let groupId: string | undefined

  try {
    // Direction 1: page exists -> same-segment group prefix rejected.
    const page = await payload.create({
      collection: 'pages',
      data: { title: `F04 page ${rand}`, slug: pageSlug },
    })
    pageId = page.id
    check(`page ${pageSlug} created`, true)
    const groupRejected = await rejectsWithValidationError(() =>
      payload.create({
        collection: 'groups',
        data: { name: `F04 group ${rand}`, prefix: `/${pageSlug}` },
      }),
    )
    check(
      `group prefix /${pageSlug} rejected while page slug ${pageSlug} exists`,
      groupRejected,
    )
    // The rejected create must not have persisted anything.
    const stray = await payload.find({
      collection: 'groups',
      where: { prefix: { equals: `/${pageSlug}` } },
      limit: 1,
      depth: 0,
    })
    check(
      `no group persisted for rejected prefix /${pageSlug}`,
      stray.docs.length === 0,
    )

    // Direction 2: group prefix exists -> same-segment page slug rejected.
    const group = await payload.create({
      collection: 'groups',
      data: { name: `F04 group ${rand}`, prefix: groupPrefix },
    })
    groupId = group.id
    const pageRejected = await rejectsWithValidationError(() =>
      payload.create({
        collection: 'pages',
        data: { title: `F04 page ${rand}`, slug: groupPrefix.slice(1) },
      }),
    )
    check(
      `page slug ${groupPrefix.slice(1)} rejected while group prefix ${groupPrefix} exists`,
      pageRejected,
    )
    const strayPage = await payload.find({
      collection: 'pages',
      where: { slug: { equals: groupPrefix.slice(1) } },
      limit: 1,
      depth: 0,
    })
    check(
      `no page persisted for rejected slug ${groupPrefix.slice(1)}`,
      strayPage.docs.length === 0,
    )

    // Control: unrelated page slug + group prefix coexist fine.
    await payload.create({
      collection: 'pages',
      data: { title: `F04 page ${rand}`, slug: `${pageSlug}-x` },
    })
    await payload.create({
      collection: 'groups',
      data: { name: `F04 group ${rand}`, prefix: `${groupPrefix}-x` },
    })
    check('non-overlapping page slug + group prefix both accepted', true)
  } finally {
    // Clean up fixtures (also guards against any half-persisted doc from a
    // partially-failed run). Payload `like` is a substring match, so `f04-`
    // covers every fixture slug/prefix this script creates.
    const cleanupPages = await payload.find({
      collection: 'pages',
      where: { slug: { like: 'f04-' } },
      limit: 50,
      depth: 0,
    })
    for (const doc of cleanupPages.docs) {
      await payload.delete({ collection: 'pages', id: doc.id })
    }
    const cleanupGroups = await payload.find({
      collection: 'groups',
      where: { prefix: { like: 'f04-' } },
      limit: 50,
      depth: 0,
    })
    for (const doc of cleanupGroups.docs) {
      await payload.delete({ collection: 'groups', id: doc.id })
    }
    void pageId
    void groupId
  }
}

void main()
  .then(() => {
    if (failures.length > 0) {
      console.error(
        `F-04 route-policy smoke FAILED: ${failures.length} check(s)`,
      )
      process.exitCode = 1
    } else {
      console.log('F-04 route-policy smoke: ALL CHECKS PASSED')
    }
  })
  .catch((err: unknown) => {
    console.error('F-04 route-policy smoke crashed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await payload.db?.destroy?.()
    } catch {
      /* best effort */
    }
  })
