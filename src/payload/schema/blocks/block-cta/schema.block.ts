import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'

import {
  identifierField,
  sectionIdField,
  textField,
  richTextField,
  uploadField,
  linkField,
} from '../../fields'

export const IDENTIFIER = 'block-cta' as const
const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(process.cwd(), 'src/payload/schema/blocks/block-cta/thumbnail.webp'),
  'base64',
)}`

export const BlockCtaBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockCtaBlock',
  admin: {
    images: {
      thumbnail: {
        url: thumbnailUrl,
        alt: 'BlockCta block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('block-cta'),
    textField({ name: 'title', label: 'Title', required: true }),
    textField({ name: 'tagline', label: 'Tagline', required: false }),
    richTextField({ name: 'description', label: 'Description' }),
    linkField({ name: 'cta', label: 'CTA Button' }),
    // Three stats — fixed 3 slots, no array needed (layout has fixed separators)
    textField({ name: 'stat1Value', label: 'Stat 1 Value' }),
    textField({ name: 'stat1Label', label: 'Stat 1 Label' }),
    textField({ name: 'stat2Value', label: 'Stat 2 Value' }),
    textField({ name: 'stat2Label', label: 'Stat 2 Label' }),
    textField({ name: 'stat3Value', label: 'Stat 3 Value' }),
    textField({ name: 'stat3Label', label: 'Stat 3 Label' }),
    uploadField('phoneMedia', { label: 'Phone Screen Media', required: false }),
  ],
} satisfies Block
