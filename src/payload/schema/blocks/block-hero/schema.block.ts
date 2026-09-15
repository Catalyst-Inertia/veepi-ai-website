import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  sectionIdField,
  richTextField,
  uploadField,
  arrayField,
  actionButtonField,
} from '../../fields'

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
    uploadField('backgroundMedia', {
      label: 'Background Media',
      required: true,
    }),
    richTextField({ name: 'title', label: 'Title' }),
    richTextField({ name: 'description', label: 'Description' }),
    arrayField({
      name: 'logos',
      label: 'Logos',
      fields: [uploadField('logo', { label: 'Logo', required: true })],
    }),
    actionButtonField({ name: 'cta', label: 'Call to Action' }),
  ],
} satisfies Block
