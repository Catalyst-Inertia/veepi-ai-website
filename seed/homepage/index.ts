/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console, @typescript-eslint/no-unused-vars -- homepage seed */
import payload from 'payload'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Page } from '../../src/payload-types'
import { ensureMedia, upsertPage } from '../lib'
import { buildHeroBlock } from './block-hero'
import { buildPricingBlock } from './block-pricing'
import { buildFaqBlock } from './block-faq'
import { buildGalleryBlock } from './block-gallery'

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
  const heroBlock = buildHeroBlock(heroBgId, mastheadId, partnerLogosId)
  if (heroBlock) {
    contents.push(heroBlock)
  }

  const galleryBlock = buildGalleryBlock(heroBgId || mastheadId)
  if (galleryBlock) {
    contents.push(galleryBlock)
  }

  contents.push(buildPricingBlock(partnerLogosId))
  contents.push(buildFaqBlock())

  // Preserve existing blocks after pricing/faq
  try {
    const existingHomepage = await payload.find({
      collection: 'pages',
      where: { isHomepage: { equals: true } },
      limit: 1,
      depth: 0,
    })
    if (existingHomepage.docs.length > 0 && existingHomepage.docs[0].contents) {
      const existingBlocks = existingHomepage.docs[0].contents.filter(
        (b) =>
          b.blockType !== 'block-hero' &&
          b.blockType !== 'block-pricing' &&
          b.blockType !== 'block-gallery' &&
          b.blockType !== 'block-faq',
      )
      contents.push(...existingBlocks)
    }
  } catch (e) {
    console.error('Failed to fetch existing homepage to preserve blocks', e)
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
