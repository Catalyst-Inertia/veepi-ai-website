import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  sectionIdField,
  textField,
  richTextField,
  actionButtonField,
  uploadField,
} from '../../fields'

// Spec item 3: block slugs use the lowercase block-<name> convention.
// Exported so the renderer can type blockType via typeof IDENTIFIER (single
// source of truth for the slug — components never duplicate the literal).
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
        // TODO: replace thumbnail.webp with a block-specific image (3:2, e.g. 600x400)
        url: thumbnailUrl,
        alt: 'BlockHero block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('block-hero'),
    textField({ name: 'title', label: 'Title', required: true }),
    textField({ name: 'heading', label: 'Heading', required: true }),
    textField({ name: 'subText', label: 'Sub Text', required: true }),
    uploadField('logo', { label: 'Logo', required: true }),
    richTextField({ name: 'description', label: 'Description' }),
    actionButtonField({ name: 'cta', label: 'Call to Action' }),
  ],
} satisfies Block
