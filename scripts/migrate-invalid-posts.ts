/**
 * One-time data migration for F-11: Post records whose `slug` is missing, not
 * a string, or empty. `posts.slug` is `required` in the schema, but the
 * underlying MongoDB schema is loose, so legacy docs can violate the contract
 * and leak invalid values into static route generation
 * (getAllPublishedPostPaths in src/cms/data/action.ts).
 *
 * Dry-run by default — prints affected posts with a proposed slug derived from
 * the title (same rules as posts.collection `formatSlug`). Pass `--apply` to
 * write the new slugs.
 *
 * Run: bunx tsx --env-file=.env scripts/migrate-invalid-posts.ts [--apply]
 */
/* eslint-disable no-console -- migration report script */
import payload from 'payload'
import config from '../payload.config'

type LoosePost = {
  id: string
  title?: unknown
  slug?: unknown
  group?: string | { id?: unknown } | null
}

const groupIdOf = (post: LoosePost): string | null => {
  const g = post.group
  if (typeof g === 'string') return g
  if (g && typeof g === 'object' && typeof g.id === 'string') return g.id
  return null
}

// Mirrors posts.collection `formatSlug` (spaces -> '-', strip non-word chars,
// lowercase), minus the slash allowance — a post slug is a single segment.
const slugify = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

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

  const res = await payload.find({ collection: 'posts', limit: 1000, depth: 0 })
  const posts = res.docs as unknown as LoosePost[]

  const invalid = posts.filter(
    (p) => typeof p.slug !== 'string' || p.slug.trim() === '',
  )

  console.log(
    `Invalid post slugs (F-11) — mode: ${apply ? 'APPLY' : 'DRY-RUN'}`,
  )
  if (invalid.length === 0) {
    console.log('No posts with a missing, non-string, or empty slug found.')
    return
  }

  // Existing valid slugs, bucketed by group, so proposed slugs stay unique
  // within each group (matching the posts.collection validate hook).
  const takenByGroup = new Map<string, Set<string>>()
  for (const post of posts) {
    if (typeof post.slug !== 'string' || post.slug.trim() === '') continue
    const gid = groupIdOf(post) ?? ''
    const set = takenByGroup.get(gid) ?? new Set<string>()
    set.add(post.slug)
    takenByGroup.set(gid, set)
  }

  const proposals = new Map<string, string>()
  for (const post of invalid) {
    const gid = groupIdOf(post) ?? ''
    const taken = takenByGroup.get(gid) ?? new Set<string>()
    takenByGroup.set(gid, taken)

    const fromTitle = typeof post.title === 'string' ? slugify(post.title) : ''
    let base = fromTitle
    if (!base || taken.has(base)) {
      base = `post-${post.id.slice(0, 6)}`
    }
    let candidate = base
    let n = 2
    while (taken.has(candidate)) {
      candidate = `${base}-${n++}`
    }
    taken.add(candidate)
    proposals.set(post.id, candidate)
  }

  printTable(
    ['POST ID', 'TITLE', 'GROUP', 'PROPOSED SLUG'],
    invalid.map((post) => [
      post.id,
      String(post.title ?? ''),
      groupIdOf(post) ?? '(none)',
      proposals.get(post.id) as string,
    ]),
  )

  if (!apply) {
    console.log('\nDry-run complete — pass --apply to write the new slugs.')
    return
  }

  console.log('')
  for (const post of invalid) {
    const slug = proposals.get(post.id) as string
    const updated = await payload.update({
      collection: 'posts',
      id: post.id,
      data: { slug },
      depth: 0,
    })
    console.log(`Applied: post ${post.id} slug -> ${updated.slug}`)
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
