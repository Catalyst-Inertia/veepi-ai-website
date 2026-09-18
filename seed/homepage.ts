/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console, @typescript-eslint/no-unused-vars -- homepage seed */
import payload from 'payload'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Page } from '../src/payload-types'
import type { BlockHeroBlock } from '../src/payload-types'
import { ensureMedia, richTextParagraph, richTextRuns, upsertPage } from './lib'

// Homepage section copy. Deliberately decoupled from src/data/homepage
// (frontend fallback copy): this module owns the copy the homepage seed
// writes, so frontend copy edits cannot silently drift seeded CMS content.
const homeHero = (
  animatedTexts: BlockHeroBlock['animatedTexts'],
  description: string,
  backgroundMedia: string,
  actionButton: { label: string; href: string },
  logos: string[],
): BlockHeroBlock => ({
  identifier: 'block-hero',
  backgroundMedia,
  animatedTexts,
  description: richTextParagraph(description),
  logos: logos.map((logo) => ({ logo })),
  cta: {
    label: actionButton.label,
    type: 'external',
    externalUrl: actionButton.href,
  },
  blockType: 'block-hero',
})
import type { BlockPricingBlock } from '../src/payload-types'

export const buildPricingBlock = (): BlockPricingBlock => ({
  identifier: 'block-pricing',
  blockType: 'block-pricing',
  sectionId: 'pricing',
  title: 'Create more.\nStay visible.',
  tagLabel: 'SUBSCRIPTION',
  tagline: richTextParagraph('Choose the plan that fits your practice.'),
  description: richTextParagraph(
    "Whether you're building your personal brand, promoting multiple treatments, or creating content at scale, VeePi gives your team access to an evolving library of creative possibilities.",
  ),
  logos: [],
  plans: [
    {
      planName: 'Essential',
      tagline: richTextParagraph(
        'For practices getting started with AI-powered content.',
      ),
      description: richTextParagraph(
        'A focused way to turn your existing results into polished social content.',
      ),
      includesLabel: 'Includes',
      includes: [
        { item: 'Access to VeePi creative concepts' },
        { item: 'AI-generated social video content' },
        { item: 'Multiple social formats' },
        { item: 'Creative direction built for medical content' },
        { item: 'Content creation workflow' },
        { item: 'Concept discovery' },
      ],
      cta: {
        label: 'CONTACT VEEPI',
        type: 'external',
        externalUrl: '#contact',
        variant: 'primary',
      },
    },
    {
      planName: 'Professional',
      tagline: richTextParagraph('For practices ready to create consistently.'),
      description: richTextParagraph(
        'A more flexible content engine for practices with an active social presence.',
      ),
      includesLabel: 'Includes',
      includes: [
        { item: 'Everything in Essential' },
        { item: 'Expanded creative possibilities' },
        { item: 'Multiple content formats' },
        { item: 'Broader specialty and content categories' },
        { item: 'Ongoing access to new creative concepts' },
        { item: 'Built for consistent social content production' },
      ],
      cta: {
        label: 'CONTACT VEEPI',
        type: 'external',
        externalUrl: '#contact',
        variant: 'primary',
      },
    },
    {
      planName: 'Custom',
      tagline: richTextParagraph('For practices and teams creating at scale.'),
      description: richTextParagraph(
        'A tailored VeePi setup built around your content needs and workflow.',
      ),
      includesLabel: 'Includes',
      includes: [
        { item: 'Everything in Professional' },
        { item: 'Custom content requirements' },
        { item: 'Scalable creative production' },
        { item: 'Tailored consultation' },
        { item: 'Practice-specific content strategy' },
      ],
      cta: {
        label: 'CONTACT VEEPI',
        type: 'external',
        externalUrl: '#contact',
        variant: 'primary',
      },
    },
  ],
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
        [
          {
            textStyle: 'heading',
            text: richTextRuns([
              [{ text: 'Turn your ' }, { text: 'results', italic: true }],
            ]),
          },
          {
            textStyle: 'heading',
            text: richTextRuns([
              [
                { text: 'into content\npeople want to ' },
                { text: 'watch.', italic: true },
              ],
            ]),
          },
          {
            textStyle: 'description',
            text: richTextRuns([
              [
                {
                  text: 'VeePi transforms your existing medical and aesthetic content into premium, social-ready videos — powered by AI and built for your practice.',
                },
              ],
              [
                {
                  text: 'From before & after results to treatment imagery, VeePi turns what you already have into creative content designed for Reels, TikTok, YouTube, Stories, and more.',
                },
              ],
            ]),
          },
        ],
        'Built for plastic surgeons, dentists, dermatologists, med spas, aesthetic clinics, and medical professionals.',
        heroBgId || mastheadId || '',
        { label: 'Get Started & See How It Works', href: '#contact' },
        [partnerLogosId || mastheadId || ''],
      ),
    )
  }
  const pricingBlock = buildPricingBlock()
  if (partnerLogosId) {
    pricingBlock.logos = [
      { logo: partnerLogosId },
      { logo: partnerLogosId },
      { logo: partnerLogosId },
    ]
  } else {
    pricingBlock.logos = []
  }
  contents.push(pricingBlock)

  contents.push({
    blockType: 'block-faq',
    identifier: 'block-faq',
    sectionId: 'faq',
    title: 'Questions, answered.',
    questions: [
      {
        question: 'What is VeePi?',
        answer: richTextParagraph(
          'VeePi is an AI-powered creative platform built specifically for medical and aesthetic professionals. It transforms existing practice content — including before & after photos, treatment imagery, videos, and results — into premium social media content.',
        ),
      },
      {
        question: 'What kind of content can I create with VeePi?',
        answer: richTextParagraph(
          'VeePi can create a range of social content including transformation videos, treatment and educational content, patient journeys, doctor branding, medical technology content, and more.',
        ),
      },
      {
        question: 'Do I need to create new content for VeePi?',
        answer: richTextParagraph(
          'No. VeePi is designed around the content you already have. You provide your source material, and VeePi turns it into a creative social concept.',
        ),
      },
      {
        question: 'Which medical specialties is VeePi built for?',
        answer: richTextParagraph(
          'VeePi is designed for medical and aesthetic professionals including plastic surgeons, cosmetic surgeons, dentists, cosmetic dentists, dermatologists, med spas, aesthetic clinics, facial rejuvenation specialists, and hair restoration specialists.',
        ),
      },
      {
        question: 'What formats can VeePi create?',
        answer: richTextParagraph(
          'Content can be adapted for multiple social formats, including 9:16, 1:1, and 16:9, for platforms and placements such as Reels, TikTok, Stories, YouTube, and social feeds.',
        ),
      },
      {
        question: 'Is VeePi just animating my photos?',
        answer: richTextParagraph(
          'No. VeePi is designed to provide the creative direction behind the content. Concepts can incorporate storytelling, hooks, camera movement, subject movement, transitions, visual effects, and cinematic direction.',
        ),
      },
      {
        question: 'Can I choose the type of creative I want?',
        answer: richTextParagraph(
          'Yes. VeePi includes a growing library of creative concepts that you can browse and use as a starting point for your own content.',
        ),
      },
      {
        question: 'How much does VeePi cost?',
        answer: richTextParagraph(
          'VeePi offers subscription options based on your content needs. Contact the VeePi team for a consultation and tailored pricing.',
        ),
      },
      {
        question: 'Can I see examples before getting started?',
        answer: richTextParagraph(
          'Yes. Explore the VeePi creative gallery to see examples of concepts, outputs, specialties, and formats.',
        ),
      },
    ],
  })

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
