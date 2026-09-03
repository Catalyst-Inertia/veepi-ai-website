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
export const IDENTIFIER = 'block-home-about' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(
    process.cwd(),
    'src/payload/schema/blocks/block-home-about/thumbnail.webp',
  ),
  'base64',
)}`

export const BlockHomeAboutBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockHomeAboutBlock',
  admin: {
    images: {
      thumbnail: {
        // Screenshot of the rendered homepage about section (3:2).
        url: thumbnailUrl,
        alt: 'HomeAbout block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    textField({ name: 'title', label: 'Section Title', required: true }),
    richTextField({ name: 'description', label: 'Description' }),
    actionButtonField(),
    uploadField('image', { required: true, label: 'About Image' }),
  ],
} satisfies Block
