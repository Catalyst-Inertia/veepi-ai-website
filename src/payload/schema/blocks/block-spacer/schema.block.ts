import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import { identifierField, sectionIdField, textField } from '../../fields'

// Exported so the renderer types blockType via typeof IDENTIFIER (single
// source of truth for the slug).
export const IDENTIFIER = 'block-spacer' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(process.cwd(), 'src/payload/schema/blocks/block-spacer/thumbnail.webp'),
  'base64',
)}`

export const BlockSpacerBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockSpacerBlock',
  admin: {
    images: {
      thumbnail: {
        // TODO: replace thumbnail.webp with a block-specific image (3:2, e.g. 600x400)
        url: thumbnailUrl,
        alt: 'Spacer block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('spacer'),
    textField({ name: 'title', label: 'Label (admin only)', required: true }),
  ],
} satisfies Block
