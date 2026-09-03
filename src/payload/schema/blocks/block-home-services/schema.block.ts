import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  textField,
  richTextField,
  arrayField,
  actionButtonField,
  uploadField,
} from '../../fields'

// Exported so the renderer types blockType via typeof IDENTIFIER (single
// source of truth for the slug).
export const IDENTIFIER = 'block-home-services' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(
    process.cwd(),
    'src/payload/schema/blocks/block-home-services/thumbnail.webp',
  ),
  'base64',
)}`

export const BlockHomeServicesBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockHomeServicesBlock',
  admin: {
    images: {
      thumbnail: {
        // Screenshot of the rendered homepage services section (3:2).
        url: thumbnailUrl,
        alt: 'HomeServices block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    textField({ name: 'title', label: 'Section Title', required: true }),
    richTextField({ name: 'description', label: 'Description' }),
    arrayField({
      name: 'services',
      label: 'Services',
      fields: [
        textField({ name: 'title', label: 'Title', required: true }),
        richTextField({
          name: 'description',
          label: 'Description',
          required: true,
        }),
      ],
    }),
    actionButtonField(),
    arrayField({
      name: 'runningText',
      label: 'Running Text Items',
      defaultValue: [
        { item: 'Custom Website Development & Redesign' },
        { item: 'Social Media Management' },
        { item: 'Digital Marketing' },
        { item: 'Mobile App Development' },
        { item: 'SEO Maximization' },
      ],
      fields: [textField({ name: 'item', label: 'Item', required: true })],
    }),
    uploadField('image', { required: true, label: 'Mascot Image' }),
  ],
} satisfies Block
