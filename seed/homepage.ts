/* eslint-disable no-console, @typescript-eslint/no-unused-vars -- homepage seed */
import payload from 'payload'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Page } from '../src/payload-types'
import type {
  BlockHeroBlock,
  BlockHomeMastheadBlock,
  BlockHomeServicesBlock,
  BlockHomeAboutBlock,
  BlockHomePortfolioBlock,
  BlockHomeContactBlock,
} from '../src/payload-types'
import { serviceData } from '../src/data/services'
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
const homepageMasthead = {
  title: 'Transform Your Business with Digital Magic',
  description:
    'We craft enchanting websites so your empire can grow without obstacles. At Catatia, our web wizards ensure every spell works flawlessly, turning your digital dreams into breathtaking reality.',
  buttonLabel: 'Unleash The Magic',
  buttonHref: '#contact',
}

const homepageRunningText = [
  'Custom Website Development & Redesign',
  'Social Media Management',
  'Digital Marketing',
  'Mobile App Development',
  'SEO Maximization',
]

const homepageServices = {
  title: 'What We Offer',
  description: [
    'At Catatia, every service is forged through elegant dark magic—websites summoned with precise incantations, brand identities carved with powerful runes, and custom systems powered by relentless digital rituals.',
    'Each creation is designed not just to look extraordinary, but to become a mighty artifact that shines fiercely within the shadows of competition.',
  ],
  buttonLabel: 'Reveal More Magic',
}

const homepageAbout = {
  title: 'About Catatia',
  paragraphs: [
    'Welcome to Catatia—where website design meets boundless innovation and every pixel carries a hint of magic. We believe a website isn’t merely about visuals; it’s about crafting an experience that connects and captivates. That’s why we’re here to elevate your website from “good” to “astonishing.” Our creative team acts as guardians of digital spells, transforming extraordinary ideas into tangible realities.',
    'Like completing a cosmic puzzle, every piece must fit perfectly and we know exactly where each one belongs.',
    'With meticulous attention to detail and a focus on measurable results, every project we craft becomes more than just a webpage it becomes an immersive experience.',
    'Reach out to us, and let’s raise your online presence to the next dimension.',
  ],
  buttonLabel: 'Feel our spirit',
  buttonHref: '#contact',
}

const homepagePortfolio = {
  title: 'Case Studies',
  description:
    'Explore the extraordinary tales behind our projects where each mission begins with a vision, every challenge unfolds like an arcane riddle, and every solution emerges as a spark of triumph. Here is where creativity, strategy, and innovation converge to exceed expectations. Discover how every idea entrusted to us transforms into a living digital masterpiece.',
  actionButton: { label: 'Discover More', href: '/projects' },
}

const homepageContact = {
  title: 'Contact Us',
  description:
    'Got a question or just want to chat ? Send us a message, we’re here to help! Don’t worry, we’re faster than lightning and friendlier than a unicorn!',
  whatsappNumber: '6282340875650',
  submitLabel: 'Summon a signal',
}

// actionButton stores the link-field shape (label, type, externalUrl); `url`
// is a virtual resolved field, so seeds write the stored form. Anchor
// targets like #contact pass the external-URL validator.
const homeMasthead = (
  title: string,
  description: string,
  actionButton: { label: string; href: string },
  image: string,
): BlockHomeMastheadBlock => ({
  identifier: 'block-home-masthead',
  title,
  description: richTextParagraph(description),
  actionButton: {
    label: actionButton.label,
    type: 'external',
    externalUrl: actionButton.href,
    variant: 'primary',
  },
  image,
  blockType: 'block-home-masthead',
})

const homeServices = (args: {
  title: string
  description: string[]
  services: { title: string; description: string }[]
  actionButton: { label: string; href?: string }
  runningText: string[]
  image: string
}): BlockHomeServicesBlock => ({
  identifier: 'block-home-services',
  title: args.title,
  description: richTextParagraphs(args.description),
  services: args.services.map((service) => ({
    title: service.title,
    description: richTextParagraph(service.description),
  })),
  actionButton: {
    label: args.actionButton.label,
    type: 'external',
    externalUrl: args.actionButton.href ?? '#contact',
    variant: 'primary',
  },
  runningText: args.runningText.map((item) => ({ item })),
  image: args.image,
  blockType: 'block-home-services',
})

const homeAbout = (
  title: string,
  description: string[],
  actionButton: { label: string; href: string },
  image: string,
): BlockHomeAboutBlock => ({
  identifier: 'block-home-about',
  title,
  description: richTextParagraphs(description),
  actionButton: {
    label: actionButton.label,
    type: 'external',
    externalUrl: actionButton.href,
    variant: 'primary',
  },
  image,
  blockType: 'block-home-about',
})

const homePortfolio = (args: {
  title: string
  description: string
  viewMoreImage: string
  actionButton: { label: string; href: string }
  posts?: { post: string }[]
}): BlockHomePortfolioBlock => ({
  identifier: 'block-home-portfolio',
  title: args.title,
  description: richTextParagraph(args.description),
  viewMoreImage: args.viewMoreImage,
  actionButton: {
    label: args.actionButton.label,
    type: 'external',
    externalUrl: args.actionButton.href,
    variant: 'primary',
  },
  ...(args.posts?.length ? { posts: args.posts } : {}),
  blockType: 'block-home-portfolio',
})

const homeContact = (args: {
  title: string
  description: string
  image: string
  whatsappNumber: string
  submitLabel: string
}): BlockHomeContactBlock => ({
  identifier: 'block-home-contact',
  title: args.title,
  description: richTextParagraph(args.description),
  image: args.image,
  whatsappNumber: args.whatsappNumber,
  submitLabel: args.submitLabel,
  blockType: 'block-home-contact',
})

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
  const [mastheadId, mascotId, aboutVideoId, contactVideoId, viewMoreImageId] =
    await Promise.all([
      ensureMedia('mashead.webm', 'Catatia masthead video'),
      ensureMedia('mascot.webm', 'Catatia mascot video'),
      ensureMedia('user.webm', 'Catatia about us video'),
      ensureMedia('unicorn.webm', 'Catatia contact us video'),
      ensureMedia('case-study-mascot.webp', 'Catatia case study mascot'),
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

  // seedProjects runs first (seed/index.ts) and creates the projects group at
  // /works; resolve it so the case-studies block can pin its feed.
  const projectsGroupResult = await payload.find({
    collection: 'groups',
    where: { prefix: { equals: '/works' } },
    limit: 1,
    depth: 0,
  })
  const projectsGroup = projectsGroupResult.docs[0]

  // Resolve the projects group's posts so the case-studies block can pin the
  // curated posts in their stored order (seedProjects created them).
  let projectPostIds: string[] = []
  if (projectsGroup) {
    const postsResult = await payload.find({
      collection: 'posts',
      where: { group: { equals: projectsGroup.id } },
      limit: 100,
      depth: 0,
    })
    projectPostIds = postsResult.docs.slice(0, 2).map((d) => String(d.id))
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
  if (mascotId) {
    contents.push(
      homeServices({
        title: homepageServices.title,
        description: [...homepageServices.description],
        services: serviceData.map((s) => ({
          title: s.title,
          description: s.description,
        })),
        actionButton: { label: homepageServices.buttonLabel },
        runningText: [...homepageRunningText],
        image: mascotId,
      }),
    )
  }
  if (aboutVideoId) {
    contents.push(
      homeAbout(
        homepageAbout.title,
        [...homepageAbout.paragraphs],
        {
          label: homepageAbout.buttonLabel,
          href: homepageAbout.buttonHref,
        },
        aboutVideoId,
      ),
    )
  }
  if (viewMoreImageId) {
    contents.push(
      homePortfolio({
        title: homepagePortfolio.title,
        description: homepagePortfolio.description,
        viewMoreImage: viewMoreImageId,
        actionButton: homepagePortfolio.actionButton,
        // Pin the curated posts (created by seedProjects) in their stored
        // order so the case-studies block shows a deterministic set in the
        // admin. Any selection — or none, falling back to the default feed —
        // is editor-drivable from the block's reorderable array rows.
        posts: projectPostIds.map((id) => ({ post: id })),
      }),
    )
  }
  if (contactVideoId) {
    contents.push(
      homeContact({
        title: homepageContact.title,
        description: homepageContact.description,
        image: contactVideoId,
        whatsappNumber: homepageContact.whatsappNumber,
        submitLabel: homepageContact.submitLabel,
      }),
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
