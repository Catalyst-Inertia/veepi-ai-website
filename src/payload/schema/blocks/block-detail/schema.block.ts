import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  sectionIdField,
  textField,
  richTextField,
  actionButtonField,
} from '../../fields'

// Exported so the renderer types blockType via typeof IDENTIFIER (single
// source of truth for the slug).
export const IDENTIFIER = 'block-detail' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(process.cwd(), 'src/payload/schema/blocks/block-detail/thumbnail.webp'),
  'base64',
)}`

export const BlockDetailBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockDetailBlock',
  admin: {
    images: {
      thumbnail: {
        url: thumbnailUrl,
        alt: 'ProjectDetail block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('detail'),
    textField({ name: 'title', label: 'Title', required: false }),
    richTextField(),
    actionButtonField(),
  ],
} satisfies Block
