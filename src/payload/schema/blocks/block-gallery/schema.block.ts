import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  sectionIdField,
  textField,
  richTextField,
  uploadField,
  arrayField,
  selectField,
  actionButtonField,
} from '../../fields'

export const IDENTIFIER = 'block-gallery' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(process.cwd(), 'src/payload/schema/blocks/block-gallery/thumbnail.webp'),
  'base64',
)}`

export const BlockGalleryBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockGalleryBlock',
  admin: {
    images: {
      thumbnail: {
        url: thumbnailUrl,
        alt: 'Block gallery thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('video-gallery'),
    textField({ name: 'title', label: 'Title', required: true }),
    richTextField({ name: 'description', label: 'Description' }),
    arrayField({
      name: 'cards',
      label: 'Cards',
      fields: [
        uploadField('media', { label: 'Media', required: true }),
        textField({ name: 'title', label: 'Title', required: true }),
        textField({ name: 'cardDescription', label: 'Description (Modal)' }),
        textField({ name: 'bestFor', label: 'Best for' }),
        textField({ name: 'input', label: 'Input' }),
        textField({ name: 'output', label: 'Output' }),
        textField({ name: 'formats', label: 'Formats' }),
        selectField({
          name: 'specialty',
          label: 'Specialty',
          options: [
            { label: 'Technology', value: 'Technology' },
            { label: 'Med Spa', value: 'Med Spa' },
            { label: 'Dentistry', value: 'Dentistry' },
            { label: 'Rhinoplasty', value: 'Rhinoplasty' },
            { label: 'Facelift', value: 'Facelift' },
          ],
        }),
        selectField({
          name: 'category',
          label: 'Category',
          options: [
            { label: 'Creative', value: 'Creative' },
            { label: 'Educational', value: 'Educational' },
            { label: 'Before & After', value: 'Before & After' },
          ],
        }),
        actionButtonField({ name: 'actionButton', label: 'Action Button' }),
      ],
    }),
  ],
} satisfies Block
