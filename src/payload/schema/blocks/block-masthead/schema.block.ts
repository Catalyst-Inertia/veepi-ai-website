import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  sectionIdField,
  textField,
  arrayField,
  uploadField,
} from '../../fields'

// Exported so the renderer types blockType via typeof IDENTIFIER (single
// source of truth for the slug).
export const IDENTIFIER = 'block-masthead' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(
    process.cwd(),
    'src/payload/schema/blocks/block-masthead/thumbnail.webp',
  ),
  'base64',
)}`

export const BlockMastheadBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockMastheadBlock',
  admin: {
    images: {
      thumbnail: {
        url: thumbnailUrl,
        alt: 'Masthead block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('masthead'),
    textField({ name: 'title', label: 'Title', required: true }),
    textField({ name: 'eyebrow', label: 'Eyebrow / Root Breadcrumb' }),
    arrayField({
      name: 'minicaps',
      label: 'Mini Caps',
      fields: [textField({ name: 'item', label: 'Item', required: true })],
    }),
    uploadField('image', { required: true, label: 'Background Image' }),
  ],
} satisfies Block
