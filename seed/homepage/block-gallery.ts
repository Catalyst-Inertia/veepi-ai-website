import type { BlockGalleryBlock } from '../../src/payload-types'
import { richTextParagraph } from '../lib'
import payload from 'payload'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function buildGalleryBlock(
  placeholderMediaId: string | undefined,
  homepageId: string,
): Promise<(BlockGalleryBlock & { blockType: 'block-gallery' }) | null> {
  if (!placeholderMediaId) return null

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

  const cards: BlockGalleryBlock['cards'] = []

  for (const data of cardsData) {
    const rawFilename =
      data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.webm'
    const filePath = join(process.cwd(), 'public/videos/gallery', rawFilename)
    let mediaId = placeholderMediaId

    if (existsSync(filePath)) {
      try {
        const buf = await readFile(filePath)
        const existing = await payload.find({
          collection: 'media',
          where: { filename: { equals: rawFilename } },
          limit: 1,
          depth: 0,
        })

        if (existing.docs.length > 0) {
          const updated = await payload.update({
            collection: 'media',
            id: existing.docs[0].id,
            data: { alt: data.title },
            file: {
              data: buf,
              mimetype: 'video/webm',
              name: rawFilename,
              size: buf.length,
            },
          })
          mediaId = updated.id
        } else {
          const created = await payload.create({
            collection: 'media',
            data: { alt: data.title },
            file: {
              data: buf,
              mimetype: 'video/webm',
              name: rawFilename,
              size: buf.length,
            },
          })
          mediaId = created.id
        }
      } catch {
        // Fallback to placeholder on failure
      }
    }

    cards.push({
      title: data.title,
      specialty: data.specialty,
      category: data.category,
      media: mediaId,
      actionButton: {
        type: 'internal',
        internalUrl: { relationTo: 'pages', value: homepageId },
        sectionId: 'pricing',
        label: 'CREATE SOMETHING LIKE THIS',
        variant: 'primary',
      },
    })
  }

  return {
    blockType: 'block-gallery',
    title: "Don't start with a blank canvas.",
    description: richTextParagraph(
      'Explore creative concepts built for medical and aesthetic storytelling.',
    ),
    cards,
  }
}
