/* eslint-disable no-console -- pages seed */
import { upsertPage, ensureMedia } from './lib'

export async function seedPages(): Promise<void> {
  const logoId = await ensureMedia('veepi-logo.svg', 'VeePi logo')
  const videoId = await ensureMedia('hero-bg.webm', 'Hero video')
  const bulletId = await ensureMedia('bullet.webm', 'Bullet')
  const doctorId = await ensureMedia('doctor.webm', 'Doctor')
  const edu03Id = await ensureMedia('edu-03.webm', 'Edu 03')
  const edu2Id = await ensureMedia('edu-2.webm', 'Edu 2')
  const getmeoutdayId = await ensureMedia('getmeoutday.webm', 'Get me out day')
  const hf1Id = await ensureMedia('hf1.webm', 'HF 1')
  const hf2Id = await ensureMedia('hf2.webm', 'HF 2')
  const hf3Id = await ensureMedia('hf3.webm', 'HF 3')
  const silliconId = await ensureMedia('sillicon.webm', 'Sillicon')

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
      {
        blockType: 'block-gallery',
        identifier: 'block-gallery',
        title: "Discover what's possible",
        cards: [
          {
            media: doctorId,
            title: 'Twin',
            specialty: 'Technology',
            category: 'Creative',
            cardDescription:
              'Bring your visual identity to life with a consistent AI-generated version of yourself, ready to appear across your content.',
            actionButton: {
              label: 'Explore Concept',
              type: 'external',
              externalUrl: '/',
            },
          },
          {
            media: bulletId,
            title: 'AI Studio',
            specialty: 'Med Spa',
            category: 'Educational',
            cardDescription:
              'Transform raw footage into polished, professional videos in minutes with our intelligent editing suite.',
            actionButton: {
              label: 'Explore Concept',
              type: 'external',
              externalUrl: '/',
            },
          },
          {
            media: edu03Id,
            title: 'After Before',
            specialty: 'Dentistry',
            category: 'Before & After',
            cardDescription:
              'Showcase stunning transformations with seamless, engaging before-and-after interactive slider videos.',
            actionButton: {
              label: 'Explore Concept',
              type: 'external',
              externalUrl: '/',
            },
          },
          {
            media: edu2Id,
            title: 'Twin',
            specialty: 'Rhinoplasty',
            category: 'Creative',
            cardDescription:
              'Scale your personal brand effortlessly. Let your digital twin handle the content creation while you focus on your practice.',
            actionButton: {
              label: 'Explore Concept',
              type: 'external',
              externalUrl: '/',
            },
          },
          {
            media: getmeoutdayId,
            title: 'AI Studio',
            specialty: 'Facelift',
            category: 'Educational',
            cardDescription:
              'Unlock creative freedom. Generate dynamic backgrounds and B-roll to elevate your storytelling.',
            actionButton: {
              label: 'Explore Concept',
              type: 'external',
              externalUrl: '/',
            },
          },
          {
            media: hf1Id,
            title: 'After Before',
            specialty: 'Technology',
            category: 'Before & After',
            cardDescription:
              'Highlight your expertise and build patient trust by visualizing true, clinical results dynamically.',
            actionButton: {
              label: 'Explore Concept',
              type: 'external',
              externalUrl: '/',
            },
          },
          {
            media: hf2Id,
            title: 'Twin',
            specialty: 'Med Spa',
            category: 'Creative',
            cardDescription:
              'Never shoot a talking-head video again. Type your script and let your AI counterpart deliver it perfectly.',
            actionButton: {
              label: 'Explore Concept',
              type: 'external',
              externalUrl: '/',
            },
          },
          {
            media: hf3Id,
            title: 'AI Studio',
            specialty: 'Dentistry',
            category: 'Educational',
            cardDescription:
              'Automate captions, color correction, and pacing so you can publish high-quality content faster.',
            actionButton: {
              label: 'Explore Concept',
              type: 'external',
              externalUrl: '/',
            },
          },
          {
            media: silliconId,
            title: 'After Before',
            specialty: 'Rhinoplasty',
            category: 'Before & After',
            cardDescription:
              'Engage your audience with striking visual evidence of your procedures, formatted perfectly for social media.',
            actionButton: {
              label: 'Explore Concept',
              type: 'external',
              externalUrl: '/',
            },
          },
        ],
      },
    ],
  } as Parameters<typeof upsertPage>[1])

  console.log('Homepage seeded')
}
