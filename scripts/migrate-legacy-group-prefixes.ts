/**
 * One-time data migration for F-05: legacy Group records whose `prefix`
 * contains an embedded '/' after the leading slash (e.g. `/projects/2-level`).
 *
 * Group prefixes are constrained to a single segment (PREFIX_PATTERN in
 * src/payload/schema/collections/groups.collection.ts); multi-segment legacy
 * prefixes leak through `getAllPublishedPostPaths()` and produce encoded,
 * unresolvable routes (`/projects%2F2-level/<slug>`).
 *
 * Dry-run by default — prints the affected groups and their member posts with
 * old/new public paths. Pass `--apply` to write the new prefixes to the Group
 * docs (Post docs are NOT touched; the group relation is unchanged).
 *
 * Run: bunx tsx --env-file=.env scripts/migrate-legacy-group-prefixes.ts [--apply]
 */
/* eslint-disable no-console -- migration report script */
import payload from 'payload'
import config from '../payload.config'
import { postPublicPath } from '../src/cms/data/tags'

// A prefix is legacy-multi-segment when another slash appears after the
// leading slash (e.g. '/projects/2-level'). Mirrors the guard added to
// getAllPublishedPostPaths() in src/cms/data/action.ts.
const EMBEDDED_SLASH = /^\/[^/]+\//
// Single-segment shape from PREFIX_PATTERN (leading slash handled separately).
const SEGMENT_PATTERN = /^[a-z0-9][a-z0-9-]*$/

type LooseGroup = {
  id: string
  name?: unknown
  prefix?: unknown
}

type LoosePost = {
  id: string
  slug?: unknown
  group?: string | { id?: unknown } | null
}

const groupIdOf = (post: LoosePost): string | null => {
  const g = post.group
  if (typeof g === 'string') return g
  if (g && typeof g === 'object' && typeof g.id === 'string') return g.id
  return null
}

const slugifySegment = (segment: string): string =>
  segment
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]+/g, '')

const pad = (value: string, width: number): string =>
  value.length >= width ? value : value + ' '.repeat(width - value.length)

const printTable = (headers: string[], rows: string[][]): void => {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length)),
  )
  console.log(headers.map((h, i) => pad(h, widths[i])).join('  '))
  console.log(widths.map((w) => '-'.repeat(w)).join('  '))
  for (const row of rows) {
    console.log(row.map((c, i) => pad(c ?? '', widths[i])).join('  '))
  }
}

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply')
  await payload.init({ config })

  const [groupsRes, postsRes] = await Promise.all([
    payload.find({ collection: 'groups', limit: 1000, depth: 0 }),
    payload.find({ collection: 'posts', limit: 1000, depth: 0 }),
  ])

  const allGroups = groupsRes.docs as unknown as LooseGroup[]
  const allPosts = postsRes.docs as unknown as LoosePost[]

  const legacyGroups = allGroups.filter(
    (g) => typeof g.prefix === 'string' && EMBEDDED_SLASH.test(g.prefix),
  )

  console.log(
    `Legacy group prefixes (F-05) — mode: ${apply ? 'APPLY' : 'DRY-RUN'}`,
  )
  if (legacyGroups.length === 0) {
    console.log('No groups with a multi-segment prefix found.')
    return
  }

  // Prefixes already in use by groups NOT being migrated. Replacement prefixes
  // must avoid colliding with these (and with each other).
  const taken = new Set<string>(
    allGroups
      .filter(
        (g) => typeof g.prefix === 'string' && !EMBEDDED_SLASH.test(g.prefix),
      )
      .map((g) => g.prefix as string),
  )

  const postsByGroup = new Map<string, LoosePost[]>()
  for (const post of allPosts) {
    const gid = groupIdOf(post)
    if (!gid) continue
    const list = postsByGroup.get(gid) ?? []
    list.push(post)
    postsByGroup.set(gid, list)
  }

  const proposals = new Map<string, string>()
  for (const group of legacyGroups) {
    const oldPrefix = group.prefix as string
    const lastSegment = oldPrefix.split('/').filter(Boolean).pop() ?? ''
    const segment = slugifySegment(lastSegment)
    const base = SEGMENT_PATTERN.test(segment)
      ? segment
      : `group-${group.id.slice(0, 6)}`
    let candidate = `/${base}`
    let n = 2
    while (taken.has(candidate)) {
      candidate = `/${base}-${n++}`
    }
    taken.add(candidate)
    proposals.set(group.id, candidate)
  }

  printTable(
    ['GROUP ID', 'NAME', 'OLD PREFIX', 'NEW PREFIX'],
    legacyGroups.map((g) => [
      g.id,
      String(g.name ?? ''),
      String(g.prefix),
      proposals.get(g.id) as string,
    ]),
  )

  const postRows: string[][] = []
  for (const group of legacyGroups) {
    const oldPrefix = group.prefix as string
    const newPrefix = proposals.get(group.id) as string
    for (const post of postsByGroup.get(group.id) ?? []) {
      const slug =
        typeof post.slug === 'string' && post.slug.length > 0
          ? post.slug
          : '<no-slug>'
      postRows.push([
        post.id,
        group.id,
        postPublicPath(oldPrefix, slug),
        postPublicPath(newPrefix, slug),
      ])
    }
  }
  if (postRows.length > 0) {
    console.log('')
    printTable(['POST ID', 'GROUP ID', 'OLD PATH', 'NEW PATH'], postRows)
  }

  if (!apply) {
    console.log('\nDry-run complete — pass --apply to write the new prefixes.')
    return
  }

  console.log('')
  for (const group of legacyGroups) {
    const newPrefix = proposals.get(group.id) as string
    const updated = await payload.update({
      collection: 'groups',
      id: group.id,
      data: { prefix: newPrefix },
      depth: 0,
    })
    console.log(`Applied: group ${group.id} prefix -> ${updated.prefix}`)
    for (const post of postsByGroup.get(group.id) ?? []) {
      const slug =
        typeof post.slug === 'string' && post.slug.length > 0
          ? post.slug
          : '<no-slug>'
      console.log(
        `  post ${post.id}: ${postPublicPath(String(group.prefix), slug)} -> ${postPublicPath(newPrefix, slug)}`,
      )
    }
  }
}

void main()
  .catch((err: unknown) => {
    console.error('Migration failed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await payload.db?.destroy?.()
    } catch {
      // best effort
    }
  })
