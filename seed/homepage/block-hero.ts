import type { BlockHeroBlock } from '../../src/payload-types'
import { richTextParagraph, richTextRuns } from '../lib'

export const buildHeroBlock = (
  heroBgId: string | undefined,
  mastheadId: string | undefined,
  partnerLogosId: string | undefined,
): BlockHeroBlock | null => {
  if (!heroBgId && !mastheadId) return null

  return {
    identifier: 'block-hero',
    blockType: 'block-hero',
    backgroundMedia: heroBgId || mastheadId || '',
    animatedTexts: [
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
    description: richTextParagraph(
      'Built for plastic surgeons, dentists, dermatologists, med spas, aesthetic clinics, and medical professionals.',
    ),
    logos: [{ logo: partnerLogosId || mastheadId || '' }],
    cta: {
      label: 'Get Started & See How It Works',
      type: 'external',
      externalUrl: '#contact',
    },
  }
}
