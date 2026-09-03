/**
 * Runtime smoke test for the `link` / `groupLink` schema fields.
 * Boots a throwaway Payload instance against a scratch DB (defaults to a
 * local mongodb://127.0.0.1:27017/link_field_smoke) and verifies:
 *   - conditional required validation (internal vs external)
 *   - external URL format validation
 *   - afterRead `url` / `newTab` resolution, incl. post -> group prefix lookup
 *   - virtual fields inside both the group and array variants
 *   - self-referential internal link (cycle) resolves without hanging
 *   - link to a deleted target resolves to null instead of breaking the read
 * Run: bunx tsx scripts/smoke-link-field.ts
 * SMOKE_DB_URL overrides the scratch database. The scratch DB is dropped at
 * the start of every run, so repeated runs are idempotent.
 */
/* eslint-disable no-console -- scratch verification script */
import { buildConfig } from 'payload'
import { getPayload } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import type { CollectionConfig } from 'payload'
import { groupLinkField, linkField } from '../src/payload/schema/fields'

const DB_URL =
  process.env.SMOKE_DB_URL || 'mongodb://127.0.0.1:27017/link_field_smoke'

// Minimal stubs — linkField only needs collections with these slugs to exist.
// Kept free of lexical/hooks so the smoke boots without the app config.
const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'isHomepage', type: 'checkbox' },
    // Present so a page read re-enters urlAfterRead (needed to exercise the
    // self-referential link cycle guard).
    linkField({ name: 'selfLink', label: 'Self Link' }),
  ],
}
const Groups: CollectionConfig = {
  slug: 'groups',
  fields: [{ name: 'prefix', type: 'text', required: true }],
}
const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'groups',
      required: true,
    },
  ],
}

const config = buildConfig({
  secret: 'smoke-test-secret',
  db: mongooseAdapter({ url: DB_URL }),
  collections: [Pages, Groups, Posts],
  globals: [
    {
      slug: 'smoke-links',
      label: 'Smoke Links',
      fields: [linkField(), groupLinkField({ name: 'nav' })],
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

type LooseLinkRow = {
  label?: string
  url?: unknown
  newTab?: unknown
}
type LoosePage = LooseLinkRow & {
  slug?: string
  selfLink?: LooseLinkRow
}
type LooseGlobal = {
  link?: LooseLinkRow
  nav?: LooseLinkRow[]
}
type LoosePayload = {
  updateGlobal: (args: {
    slug: string
    data: Record<string, unknown>
  }) => Promise<unknown>
  create: (args: {
    collection: string
    data: Record<string, unknown>
  }) => Promise<{ id: string }>
  update: (args: {
    collection: string
    id: string
    data: Record<string, unknown>
  }) => Promise<unknown>
  findByID: (args: {
    collection: string
    id: string
    depth?: number
  }) => Promise<LoosePage | null>
  delete: (args: {
    collection: string
    where: Record<string, unknown>
  }) => Promise<unknown>
  findGlobal: (args: { slug: string; depth?: number }) => Promise<LooseGlobal>
}

/**
 * Bound a read so a regression (unbounded resolution recursion) surfaces as
 * a failed check instead of hanging the smoke forever.
 */
const withTimeout = <T>(p: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout: ${label}`)), ms),
    ),
  ])

const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err)

const main = async () => {
  // Fresh scratch DB every run — previous runs may have left partial state.
  const mongoose = (await import('mongoose')).default
  await mongoose.connect(DB_URL)
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()

  // The scratch global slug is not in generated payload-types; cast at the
  // boundary once and keep the rest of the script readable.
  const payload = (await getPayload({ config })) as unknown as LoosePayload

  const tryUpdate = async (
    data: Record<string, unknown>,
  ): Promise<string | null> => {
    try {
      await payload.updateGlobal({ slug: 'smoke-links', data })
      return null
    } catch (err) {
      return err instanceof Error ? err.message : String(err)
    }
  }

  const page = await payload.create({
    collection: 'pages',
    data: {
      title: 'Smoke Page',
      slug: 'smoke-page',
      // Payload 3.87 validates nested requireds of a group even when absent;
      // the stub always stores a valid (external) placeholder, swapped below.
      selfLink: {
        label: 'Tmp',
        type: 'external',
        externalUrl: '#tmp',
        target: '_self',
      },
    },
  })
  const homepage = await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'homepage',
      isHomepage: true,
      selfLink: {
        label: 'Tmp',
        type: 'external',
        externalUrl: '#tmp',
        target: '_self',
      },
    },
  })
  const group = await payload.create({
    collection: 'groups',
    data: { prefix: '/projects' },
  })
  const post = await payload.create({
    collection: 'posts',
    data: { title: 'Smoke Post', slug: 'smoke-post', group: group.id },
  })

  const resetShape = {
    link: {
      label: 'Cleanup',
      type: 'external',
      externalUrl: '#cleanup',
      target: '_self',
    },
    nav: [],
  }

  // --- validation: internal requires internalUrl ---
  const invalidInternal = await tryUpdate({
    link: { label: 'X', type: 'internal' },
    nav: [],
  })
  check('internal type rejects missing internalUrl', invalidInternal !== null)
  if (invalidInternal !== null) {
    const line = invalidInternal
      .split('\n')
      .find((l) => l.includes('Internal URL'))
    console.log(`    message: ${line ?? invalidInternal.split('\n')[0]}`)
  }

  // --- validation: external requires externalUrl ---
  const invalidExternal = await tryUpdate({
    link: { label: 'X', type: 'external', externalUrl: '' },
    nav: [],
  })
  check('external type rejects missing externalUrl', invalidExternal !== null)

  // --- validation: external format ---
  const badFormat = await tryUpdate({
    link: { label: 'X', type: 'external', externalUrl: 'not a url' },
    nav: [],
  })
  check('external rejects malformed url', badFormat !== null)

  // --- validation: /wa.me/ (leading slash) is a relative path, not wa.me ---
  const slashWa = await tryUpdate({
    link: { label: 'X', type: 'external', externalUrl: '/wa.me/789' },
    nav: [],
  })
  check('external accepts /wa.me/ relative path', slashWa === null, slashWa)

  // --- validation: every accepted scheme requires a non-empty destination ---
  const validExternal: Array<[string, string]> = [
    ['#contact', 'anchor'],
    ['/about', 'relative path'],
    ['https://example.com', 'https url'],
    ['tel:+123', 'tel'],
    ['mailto:a@b.co', 'mailto'],
    ['wa.me/628123', 'bare wa.me'],
    ['https://wa.me/628123', 'absolute wa.me'],
  ]
  for (const [externalUrl, flavour] of validExternal) {
    const err = await tryUpdate({
      link: { label: `X ${flavour}`, type: 'external', externalUrl },
      nav: [],
    })
    check(`external accepts ${flavour} (${externalUrl})`, err === null, err)
  }

  const invalidExternalUrls = [
    'https://',
    'tel:',
    'mailto:',
    'wa.me/',
    '#',
    '/',
    'ftp://x',
  ]
  for (const externalUrl of invalidExternalUrls) {
    const err = await tryUpdate({
      link: { label: `X ${externalUrl}`, type: 'external', externalUrl },
      nav: [],
    })
    check(`external rejects incomplete ${externalUrl}`, err !== null, err)
  }

  // --- valid doc with every link flavour ---
  const saved = await tryUpdate({
    link: {
      label: 'Projects',
      type: 'internal',
      internalUrl: { relationTo: 'posts', value: post.id },
      target: '_blank',
    },
    nav: [
      {
        label: 'Page',
        type: 'internal',
        internalUrl: { relationTo: 'pages', value: page.id },
        target: '_self',
      },
      {
        label: 'Home',
        type: 'internal',
        internalUrl: { relationTo: 'pages', value: homepage.id },
        target: '_self',
      },
      { label: 'Anchor', type: 'external', externalUrl: '#contact' },
      {
        label: 'Tel',
        type: 'external',
        externalUrl: 'tel:+123456789',
        target: '_blank',
      },
      { label: 'Mail', type: 'external', externalUrl: 'mailto:hi@catatia.dev' },
      { label: 'WA', type: 'external', externalUrl: 'https://wa.me/123' },
      { label: 'WA bare', type: 'external', externalUrl: 'wa.me/628123' },
    ],
  })
  check('valid link doc saves', saved === null, saved)

  // --- read back at depth 1 (same as getHeaderData/getFooterData) ---
  const read = await payload.findGlobal({ slug: 'smoke-links', depth: 1 })
  const readLink = read.link ?? {}

  check(
    'group link url resolves post -> /projects/smoke-post',
    readLink.url === '/projects/smoke-post',
    readLink.url,
  )
  check(
    'group link newTab true when target=_blank',
    readLink.newTab === true,
    readLink.newTab,
  )

  const nav = read.nav ?? []
  const byLabel = (label: string) => nav.find((n) => n.label === label)
  check(
    'array link resolves page path',
    byLabel('Page')?.url === '/smoke-page',
    byLabel('Page')?.url,
  )
  check(
    'array link homepage -> /',
    byLabel('Home')?.url === '/',
    byLabel('Home')?.url,
  )
  check(
    'anchor passes through',
    byLabel('Anchor')?.url === '#contact',
    byLabel('Anchor')?.url,
  )
  check(
    'tel passes through',
    byLabel('Tel')?.url === 'tel:+123456789',
    byLabel('Tel')?.url,
  )
  check(
    'mailto passes through',
    byLabel('Mail')?.url === 'mailto:hi@catatia.dev',
    byLabel('Mail')?.url,
  )
  check(
    'wa.me passes through',
    byLabel('WA')?.url === 'https://wa.me/123',
    byLabel('WA')?.url,
  )
  check(
    'bare wa.me normalizes to absolute https url',
    byLabel('WA bare')?.url === 'https://wa.me/628123',
    byLabel('WA bare')?.url,
  )
  check(
    'newTab false for _self',
    byLabel('Page')?.newTab === false,
    byLabel('Page')?.newTab,
  )

  // --- cycle guard: internal link pointing at the linking page itself ---
  // Regression: urlAfterRead used to call findByID on the target; a
  // self-link re-entered the same afterRead hook for the same id and
  // recursed until the read hung (admin + public route both unopenable).
  const selfPage = await payload.create({
    collection: 'pages',
    data: {
      title: 'Self Page',
      slug: 'self-page',
      selfLink: {
        label: 'Tmp',
        type: 'external',
        externalUrl: '#tmp',
        target: '_self',
      },
    },
  })
  await payload.update({
    collection: 'pages',
    id: selfPage.id,
    data: {
      selfLink: {
        label: 'Self',
        type: 'internal',
        internalUrl: { relationTo: 'pages', value: selfPage.id },
        target: '_self',
      },
    },
  })
  let selfRead: LoosePage | null = null
  try {
    selfRead = await withTimeout(
      payload.findByID({ collection: 'pages', id: selfPage.id, depth: 0 }),
      8000,
      'self-link page read',
    )
    check('self-referential internal link read settles', true)
  } catch (err) {
    check(
      'self-referential internal link read settles',
      false,
      errorMessage(err),
    )
  }
  check(
    'self-link resolves its own public path',
    selfRead?.selfLink?.url === '/self-page',
    selfRead?.selfLink?.url,
  )

  // --- resilience: link target deleted after save ---
  // Regression: resolution threw on a missing target, taking down the whole
  // read of the document containing the link.
  const deletedTarget = await payload.create({
    collection: 'pages',
    data: {
      title: 'Orphan',
      slug: 'orphan-target',
      selfLink: {
        label: 'Tmp',
        type: 'external',
        externalUrl: '#tmp',
        target: '_self',
      },
    },
  })
  await payload.update({
    collection: 'pages',
    id: selfPage.id,
    data: {
      selfLink: {
        label: 'Orphan',
        type: 'internal',
        internalUrl: { relationTo: 'pages', value: deletedTarget.id },
        target: '_self',
      },
    },
  })
  await payload.delete({
    collection: 'pages',
    where: { slug: { equals: 'orphan-target' } },
  })
  let orphanRead: LoosePage | null = null
  try {
    orphanRead = await withTimeout(
      payload.findByID({ collection: 'pages', id: selfPage.id, depth: 0 }),
      8000,
      'orphan link read',
    )
    check('link to deleted page still reads', orphanRead !== null)
  } catch (err) {
    check('link to deleted page still reads', false, errorMessage(err))
  }
  check(
    'deleted target resolves url to null',
    orphanRead?.selfLink?.url == null,
    orphanRead?.selfLink?.url,
  )

  // --- cleanup ---
  await payload.updateGlobal({ slug: 'smoke-links', data: resetShape })
  await payload.delete({
    collection: 'posts',
    where: { slug: { equals: 'smoke-post' } },
  })
  await payload.delete({
    collection: 'pages',
    where: { slug: { in: ['smoke-page', 'homepage', 'self-page'] } },
  })
  await payload.delete({
    collection: 'groups',
    where: { prefix: { equals: '/projects' } },
  })

  console.log(
    failures.length === 0
      ? '\nALL CHECKS PASSED'
      : `\n${failures.length} CHECK(S) FAILED`,
  )
  process.exit(failures.length === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('smoke failed:', err)
  process.exit(1)
})
