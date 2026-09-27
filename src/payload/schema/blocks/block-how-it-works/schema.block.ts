import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  sectionIdField,
  textField,
  richTextField,
  arrayField,
} from '../../fields'

export const IDENTIFIER = 'block-how-it-works' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(
    process.cwd(),
    'src/payload/schema/blocks/block-how-it-works/thumbnail.webp',
  ),
  'base64',
)}`

export const BlockHowItWorksBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockHowItWorksBlock',
  admin: {
    images: {
      thumbnail: {
        url: thumbnailUrl,
        alt: 'Block how it works thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('how-it-works'),
    textField({ name: 'title', label: 'Title', required: true }),
    richTextField({ name: 'description', label: 'Description' }),
    arrayField({
      name: 'steps',
      label: 'Steps',
      fields: [
        textField({ name: 'title', label: 'Title', required: true }),
        textField({ name: 'description', label: 'Description' }),
      ],
    }),
  ],
} satisfies Block
