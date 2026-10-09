/* eslint-disable no-console -- pages seed */
import { upsertPage, ensureMedia, richTextParagraph } from './lib'

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
  const distributionId = await ensureMedia(
    'distribution.webm',
    'Distribution video',
  )
  const ogImageMediaId = await ensureMedia('veepi-og.png', 'VeePi OG Image')

  await upsertPage('home', {
    isHomepage: true,
    title: 'VeePi - Home',
    seo: {
      title: 'VeePi - AI Video Platform for Medical & Aesthetic Practices',
      description:
        'Transform your patient results and treatment imagery into high-performing video content for Reels, TikTok, YouTube, and Stories. Built for aesthetic & medical professionals.',
      keywords:
        'VeePi, medical aesthetics, AI video, aesthetic practice marketing, med spa video, patient storytelling, medical marketing',
      og_image: ogImageMediaId,
    },
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
          label: 'Schedule a Call',
          type: 'external',
          externalUrl: 'https://calendly.com/chris-tixta/website',
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
        description: richTextParagraph(
          'Explore creative concepts built for medical and aesthetic storytelling.',
        ),
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
      {
        blockType: 'block-distribution',
        identifier: 'block-distribution',
        heading: 'One story. Every format.',
        tagLabel: 'DISTRIBUTION',
        description:
          'VeePi adapts your creative for every platform without losing the story.',
        backgroundMedia: distributionId,
      },
      {
        blockType: 'block-cta',
        identifier: 'block-cta',
        title: 'Your results are already worth sharing.',
        tagline: 'VeePi turns them into content.',
        description: richTextParagraph(
          "Bring your existing medical and aesthetic content to life with creative concepts built to stop the scroll, tell the story, and showcase the work you're already doing.",
        ),
        cta: {
          type: 'external',
          externalUrl: 'https://calendly.com/chris-tixta/website',
          label: 'Schedule a Call',
        },
        stat1Value: '3,000+',
        stat1Label: 'Medical Practices Worldwide Since 2017',
        stat2Value: '2.4M+',
        stat2Label: 'Social Media Posts',
        stat3Value: '15B+',
        stat3Label: 'Total Views Reached',
        phoneMedia: videoId,
      },
    ],
  } as Parameters<typeof upsertPage>[1])

  console.log('Homepage seeded')
}
