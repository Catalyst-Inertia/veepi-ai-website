import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import { identifierField, textField, uploadField } from '../../fields'

export const IDENTIFIER = 'block-showcase' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(
    process.cwd(),
    'src/payload/schema/blocks/block-showcase/thumbnail.webp',
  ),
  'base64',
)}`

export const BlockShowcaseBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockShowcaseBlock',
  admin: {
    images: {
      thumbnail: {
        url: thumbnailUrl,
        alt: 'BlockShowcase block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    textField({
      name: 'heading',
      label: 'Heading',
      required: true,
      defaultValue: 'All from one software.',
    }),
    textField({
      name: 'rating',
      label: 'Rating',
      required: true,
      defaultValue: '4.9/5.0',
    }),
    textField({
      name: 'ratingSubtitle',
      label: 'Rating Subtitle',
      required: true,
      defaultValue: 'rated by 3000+ practices in 14 countries',
    }),
    uploadField('video1', { label: 'Video 1 (Left)', required: true }),
    uploadField('video2', { label: 'Video 2 (Center)', required: true }),
    uploadField('video3', { label: 'Video 3 (Right)', required: true }),
    uploadField('video4', { label: 'Video 4 (Bottom Left)', required: true }),
    uploadField('video5', { label: 'Video 5 (Bottom Right)', required: true }),
    uploadField('video6', { label: 'Video 6 (Optional)', required: false }),
  ],
} satisfies Block
