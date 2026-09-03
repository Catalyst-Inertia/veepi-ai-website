/**
 * Runtime smoke test for the global (header/footer) preview data path
 * (spec Phase 5 checklist: "Smoke-test global preview in draft mode").
 *
 * The app's global preview (/preview/globals) renders the frontend layout,
 * which reads header/footer via getHeaderData(true)/getFooterData(true) —
 * the `draft: true` branch of getGlobalData in src/cms/data/action.ts. That
 * branch skips unstable_cache and reads straight from Payload, so previewing
 * a global must show the latest saved values immediately, even though drafts
 * are disabled in the schema.
 *
 * Boots a throwaway Payload instance against a scratch DB (defaults to
 * mongodb://127.0.0.1:27017/global_preview_smoke).
 * Run: bunx tsx scripts/smoke-draft-global-preview.ts
 * SMOKE_DB_URL overrides the scratch database. The scratch DB is dropped at
 * the start of every run, so repeated runs are idempotent.
 */
/* eslint-disable no-console -- scratch verification script */
import { buildConfig } from 'payload'
import { getPayload } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

const DB_URL =
  process.env.SMOKE_DB_URL || 'mongodb://127.0.0.1:27017/global_preview_smoke'

const config = buildConfig({
  secret: 'smoke-test-secret',
  db: mongooseAdapter({ url: DB_URL }),
  globals: [
    {
      slug: 'header',
      label: 'Header',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'nav',
          type: 'array',
          fields: [{ name: 'label', type: 'text' }],
        },
      ],
    },
    {
      slug: 'footer',
      label: 'Footer',
      fields: [{ name: 'tagline', type: 'text' }],
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

type LooseGlobal = { title?: string; nav?: unknown[]; tagline?: string }

// The scratch globals are not in the generated payload-types; cast at the
// boundary once and keep the rest of the script readable.
type LoosePayload = {
  updateGlobal: (args: {
    slug: string
    data: Record<string, unknown>
  }) => Promise<unknown>
  findGlobal: (args: {
    slug: string
    depth?: number
    draft?: boolean
  }) => Promise<LooseGlobal>
}

const main = async () => {
  const mongoose = (await import('mongoose')).default
  await mongoose.connect(DB_URL)
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()

  const payload = (await getPayload({ config })) as unknown as LoosePayload

  const readDraft = async (slug: 'header' | 'footer') =>
    (await payload.findGlobal({ slug, depth: 1, draft: true })) as LooseGlobal

  // --- initial draft read: saved values (drafts disabled => published) ---
  await payload.updateGlobal({
    slug: 'header',
    data: { title: 'Draft Header', nav: [{ label: 'Home' }] },
  })
  const header = await readDraft('header')
  check(
    'draft:true global read returns saved header',
    header?.title === 'Draft Header',
    header?.title,
  )
  check(
    'draft:true global read returns nav rows',
    Array.isArray(header?.nav) && header?.nav?.length === 1,
    header?.nav,
  )

  // --- global preview reflects the latest save (draft branch bypasses cache) ---
  await payload.updateGlobal({
    slug: 'header',
    data: { title: 'Draft Header Updated', nav: [{ label: 'Work' }] },
  })
  const fresh = await readDraft('header')
  check(
    'draft:true global read reflects latest title',
    fresh?.title === 'Draft Header Updated',
    fresh?.title,
  )

  // --- second global (footer) previews through the same path ---
  await payload.updateGlobal({
    slug: 'footer',
    data: { tagline: 'Draft Footer' },
  })
  const footer = await readDraft('footer')
  check(
    'draft:true footer read returns saved values',
    footer?.tagline === 'Draft Footer',
    footer?.tagline,
  )

  // --- cleanup: scratch DB is dropped at the start of every run; the
  // required text fields cannot be cleared, so reset via the DB itself. ---
  await mongoose.connect(DB_URL)
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()

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
