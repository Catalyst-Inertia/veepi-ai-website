/**
 * One-time data migration for the homepage flag (isHomepage).
 *
 * The homepage is now decided by pages.isHomepage (sidebar checkbox), never
 * by the slug. Existing sites store the homepage as slug 'homepage' with no
 * flag; this stamps that document with isHomepage: true.
 *
 * Safety: if ANY page already carries the flag, the migration does nothing —
 * the site is already on the new model and its chosen homepage is respected.
 *
 * Dry-run by default — prints what would change. Pass `--apply` to write.
 *
 * Run: bunx tsx --env-file=.env scripts/migrate-homepage-flag.ts [--apply]
 */
/* eslint-disable no-console -- migration report script */
import payload from 'payload'
import config from '../payload.config'

type LoosePage = {
  id: string
  slug?: unknown
  isHomepage?: unknown
}

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply')
  await payload.init({ config })

  const res = await payload.find({ collection: 'pages', limit: 1000, depth: 0 })
  const pages = res.docs as unknown as LoosePage[]

  const flagged = pages.filter((p) => p.isHomepage === true)
  const legacyHomepage = pages.filter((p) => p.slug === 'homepage')

  console.log(
    `pages: ${pages.length}, flagged: ${flagged.length}, slug-homepage: ${legacyHomepage.length}`,
  )

  if (flagged.length > 0) {
    console.log(
      `a homepage is already flagged (${flagged
        .map((p) => p.slug)
        .join(', ')}) — nothing to change`,
    )
    process.exit(0)
  }

  const toStamp = legacyHomepage.filter((p) => p.isHomepage !== true)
  if (toStamp.length === 0) {
    console.log('no slug-homepage page needs the flag — nothing to do')
    process.exit(0)
  }
  for (const page of toStamp) {
    console.log(`stamp isHomepage=true on ${page.id} (slug=${page.slug})`)
  }

  if (!apply) {
    console.log('\ndry run — pass --apply to write changes')
    process.exit(0)
  }

  for (const page of toStamp) {
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { isHomepage: true },
    })
  }
  console.log(`\napplied: stamped ${toStamp.length}`)
  process.exit(0)
}

void main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
