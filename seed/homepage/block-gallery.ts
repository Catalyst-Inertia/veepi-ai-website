import type { BlockGalleryBlock } from '../../src/payload-types'
import { richTextParagraph } from '../lib'

export function buildGalleryBlock(
  galleryMediaId: string | undefined,
): (BlockGalleryBlock & { blockType: 'block-gallery' }) | null {
  if (!galleryMediaId) return null

  const cardsData = [
    {
      title: 'Create with VeePi',
      specialty: 'Technology',
      category: 'Creative',
    },
    { title: 'Inside The Skin', specialty: 'Med Spa', category: 'Educational' },
    {
      title: 'Desert to Silk',
      specialty: 'Med Spa',
      category: 'Before & After',
    },
    {
      title: 'The Confidence Boost',
      specialty: 'Dentistry',
      category: 'Before & After',
    },
    { title: 'Sculpted', specialty: 'Rhinoplasty', category: 'Before & After' },
    {
      title: 'See Through Your Nose',
      specialty: 'Rhinoplasty',
      category: 'Educational',
    },
    {
      title: 'Younger Than Before',
      specialty: 'Facelift',
      category: 'Before & After',
    },
    {
      title: 'Smile Architecture',
      specialty: 'Dentistry',
      category: 'Educational',
    },
    {
      title: 'Profile Blueprint',
      specialty: 'Facelift',
      category: 'Educational',
    },
  ] as const

  return {
    blockType: 'block-gallery',
    title: "Don't start with a blank canvas.",
    description: richTextParagraph(
      'Explore creative concepts built for medical and aesthetic storytelling.',
    ),
    cards: cardsData.map((data) => ({
      title: data.title,
      specialty: data.specialty,
      category: data.category,
      media: galleryMediaId,
      link: {
        type: 'external',
        externalUrl: 'https://example.com',
        label: 'Explore Concept',
      },
    })),
  }
}
