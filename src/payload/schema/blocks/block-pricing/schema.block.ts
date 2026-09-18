import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  sectionIdField,
  textField,
  richTextField,
  arrayField,
  uploadField,
  actionButtonField,
} from '../../fields'

// Spec item 3: block slugs use the lowercase block-<name> convention.
// Exported so the renderer can type blockType via typeof IDENTIFIER (single
// source of truth for the slug — components never duplicate the literal).
export const IDENTIFIER = 'block-pricing' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(process.cwd(), 'src/payload/schema/blocks/block-pricing/thumbnail.webp'),
  'base64',
)}`

export const BlockPricingBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockPricingBlock',
  admin: {
    images: {
      thumbnail: {
        // TODO: replace thumbnail.webp with a block-specific image (3:2, e.g. 600x400)
        url: thumbnailUrl,
        alt: 'BlockPricing block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('pricing'),
    textField({ name: 'title', label: 'Title', required: true }),
    textField({
      name: 'tagLabel',
      label: 'Tag Label',
      defaultValue: 'SUBSCRIPTION',
    }),
    richTextField({ name: 'tagline', label: 'Tagline' }),
    richTextField({ name: 'description', label: 'Description' }),
    arrayField({
      name: 'logos',
      label: 'Logos',
      fields: [uploadField('logo', { label: 'Logo', required: true })],
    }),
    arrayField({
      name: 'plans',
      label: 'Plans',
      fields: [
        textField({ name: 'planName', label: 'Plan Name', required: true }),
        richTextField({ name: 'tagline', label: 'Tagline' }),
        richTextField({ name: 'description', label: 'Description' }),
        textField({
          name: 'includesLabel',
          label: 'Includes Label',
          defaultValue: 'Includes',
        }),
        arrayField({
          name: 'includes',
          label: 'Includes Items',
          fields: [textField({ name: 'item', label: 'Item', required: true })],
        }),
        actionButtonField({ name: 'cta', label: 'Call to Action' }),
      ],
    }),
  ],
} satisfies Block
