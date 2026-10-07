import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  sectionIdField,
  textField,
  uploadField,
} from '../../fields'

export const IDENTIFIER = 'block-distribution' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(
    process.cwd(),
    'src/payload/schema/blocks/block-distribution/thumbnail.webp',
  ),
  'base64',
)}`

export const BlockDistributionBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockDistributionBlock',
  admin: {
    images: {
      thumbnail: {
        url: thumbnailUrl,
        alt: 'Block distribution thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('distribution'),
    textField({
      name: 'heading',
      label: 'Heading',
      required: true,
      defaultValue: 'One story. Every format.',
    }),
    textField({
      name: 'tagLabel',
      label: 'Tag Label (pill text)',
      required: true,
      defaultValue: 'DISTRIBUTION',
    }),
    textField({
      name: 'description',
      label: 'Description (below tag)',
      required: true,
      defaultValue:
        'VeePi adapts your creative for every platform without losing the story.',
    }),
    uploadField('backgroundMedia', {
      label: 'Background Video / Image',
      required: true,
    }),
  ],
} satisfies Block
