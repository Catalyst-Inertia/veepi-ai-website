/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console, @typescript-eslint/no-unused-vars -- homepage seed */
import payload from 'payload'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Page } from '../src/payload-types'
import type { BlockHeroBlock } from '../src/payload-types'
import {
  ensureMedia,
  richTextParagraph,
  richTextParagraphs,
  richTextRuns,
  upsertPage,
} from './lib'

// Homepage section copy. Deliberately decoupled from src/data/homepage
// (frontend fallback copy): this module owns the copy the homepage seed
// writes, so frontend copy edits cannot silently drift seeded CMS content.
const homeHero = (
  title: BlockHeroBlock['title'],
  description: string,
  backgroundMedia: string,
  actionButton: { label: string; href: string },
  logos: string[],
): BlockHeroBlock => ({
  identifier: 'block-hero',
  backgroundMedia,
  title,
  description: richTextParagraph(description),
  logos: logos.map((logo) => ({ logo })),
  cta: {
    label: actionButton.label,
    type: 'external',
    externalUrl: actionButton.href,
  },
  blockType: 'block-hero',
})

export async function seedHomepage(): Promise<void> {
  // Upload section media (webm videos where available), then compose the
  // block-home-* blocks in page order (masthead, services, about, portfolio,
  // contact). MediaVisual renders a <video> when the doc mimeType is video/*.
  const [mastheadId] = await Promise.all([
    ensureMedia('mashead.webm', 'Catatia masthead video'),
  ])

  let heroBgId: string | undefined
  let partnerLogosId: string | undefined
  try {
    const bgBuf = await readFile(
      join(process.cwd(), 'public/videos/veepi-bg.webm'),
    )
    const bgCreated = await payload.create({
      collection: 'media',
      data: { alt: 'Hero BG Video' },
      file: {
        data: bgBuf,
        mimetype: 'video/webm',
        name: 'veepi-bg.webm',
        size: bgBuf.length,
      },
    })
    heroBgId = String(bgCreated.id)

    const logosBuf = await readFile(
      join(process.cwd(), 'public/partner-logos.svg'),
    )
    const logosCreated = await payload.create({
      collection: 'media',
      data: { alt: 'Partner Logos' },
      file: {
        data: logosBuf,
        mimetype: 'image/svg+xml',
        name: 'partner-logos.svg',
        size: logosBuf.length,
      },
    })
    partnerLogosId = String(logosCreated.id)
  } catch (e) {
    console.error('Failed to upload hero assets', e)
  }

  const contents: Page['contents'] = []
  if (heroBgId || mastheadId) {
    contents.push(
      homeHero(
        richTextRuns([
          [{ text: 'Turn your ' }, { text: 'results', italic: true }],
          [
            { text: 'into content\npeople want to ' },
            { text: 'watch.', italic: true },
          ],
        ]),
        'Built for plastic surgeons, dentists, dermatologists, med spas, aesthetic clinics, and medical professionals.',
        heroBgId || mastheadId || '',
        { label: 'Get Started & See How It Works', href: '#contact' },
        [partnerLogosId || mastheadId || ''],
      ),
    )
  }

  const homepage = await upsertPage('homepage', {
    title: 'Homepage',
    // isHomepage is the sole homepage discriminator (route resolution looks
    // at the flag, never the slug); the collection hook clears the flag on
    // every other page, so re-seeding self-heals ownership.
    isHomepage: true,
    seo: {
      title: 'Catatia — Digital Studio',
      description: 'We craft digital experiences.',
      keywords: 'digital,studio,design',
    },
    contents,
  })
  console.log('Page homepage:', homepage.id)
}
