import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  textField,
  richTextField,
  actionButtonField,
  uploadField,
} from '../../fields'

// Exported so the renderer types blockType via typeof IDENTIFIER (single
// source of truth for the slug).
export const IDENTIFIER = 'block-home-masthead' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(
    process.cwd(),
    'src/payload/schema/blocks/block-home-masthead/thumbnail.webp',
  ),
  'base64',
)}`

export const BlockHomeMastheadBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockHomeMastheadBlock',
  admin: {
    images: {
      thumbnail: {
        // Screenshot of the rendered homepage masthead section (3:2).
        url: thumbnailUrl,
        alt: 'HomeMasthead block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    textField({ name: 'title', label: 'Title (H1)', required: true }),
    richTextField({ name: 'description', label: 'Description' }),
    actionButtonField(),
    uploadField('image', { required: true, label: 'Banner Image' }),
  ],
} satisfies Block
