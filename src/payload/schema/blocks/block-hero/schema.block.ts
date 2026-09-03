import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import { identifierField, sectionIdField, textField } from '../../fields'

// Exported so the renderer types blockType via typeof IDENTIFIER (single
// source of truth for the slug).
export const IDENTIFIER = 'block-hero' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(process.cwd(), 'src/payload/schema/blocks/block-hero/thumbnail.webp'),
  'base64',
)}`

export const BlockHeroBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockHeroBlock',
  admin: {
    images: {
      thumbnail: {
        url: thumbnailUrl,
        alt: 'Hero block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('hero'),
    textField({ name: 'title', label: 'Title', required: true }),
    // TODO: add fields
  ],
} satisfies Block
