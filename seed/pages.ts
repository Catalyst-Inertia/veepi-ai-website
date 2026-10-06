/* eslint-disable no-console -- pages seed */
import { upsertPage, ensureMedia } from './lib'

export async function seedPages(): Promise<void> {
  const logoId = await ensureMedia('veepi-logo.svg', 'VeePi logo')
  const videoId = await ensureMedia('hero-bg.webm', 'Hero video')

  await upsertPage('home', {
    isHomepage: true,
    title: 'VeePi - Home',
    contents: [
      {
        blockType: 'block-hero',
        identifier: 'block-hero',
        title: 'Create Unlimited Videos',
        heading: 'for Your Medical Practice',
        subText: 'Plastic Surgery | Dermatologist | Med Spa | Dentist',
        logo: logoId,
        description: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'heading',
                tag: 'h3',
                format: 'center',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    format: 0,
                    version: 1,
                    detail: 0,
                    mode: 'normal',
                    style: '',
                    text: 'VeePi transforms your existing medical and aesthetic content into premium, social-ready videos.',
                  },
                ],
              },
              {
                type: 'paragraph',
                format: 'center',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    format: 0,
                    version: 1,
                    detail: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Powered by AI and built for your practice, with your results and treatment imagery ready for Reels, TikTok, YouTube, Stories, and more.',
                  },
                ],
              },
            ],
          },
        },
        cta: {
          label: 'GET STARTED & SEE HOW IT WORKS',
          type: 'external',
          externalUrl: '/get-started',
        },
      },
      {
        blockType: 'block-showcase',
        identifier: 'block-showcase',
        heading: 'All from one software.',
        rating: '4.9/5.0',
        ratingSubtitle: 'rated by 3000+ practices in 14 countries',
        video1: videoId,
        video2: videoId,
        video3: videoId,
        video4: videoId,
        video5: videoId,
      },
    ],
  } as Parameters<typeof upsertPage>[1])

  console.log('Homepage seeded')
}
