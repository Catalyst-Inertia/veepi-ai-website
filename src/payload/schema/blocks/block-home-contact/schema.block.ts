import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  textField,
  richTextField,
  uploadField,
} from '../../fields'

// Exported so the renderer types blockType via typeof IDENTIFIER (single
// source of truth for the slug).
export const IDENTIFIER = 'block-home-contact' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(
    process.cwd(),
    'src/payload/schema/blocks/block-home-contact/thumbnail.webp',
  ),
  'base64',
)}`

export const BlockHomeContactBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockHomeContactBlock',
  admin: {
    images: {
      thumbnail: {
        // Screenshot of the rendered homepage contact section (3:2).
        url: thumbnailUrl,
        alt: 'HomeContact block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    textField({ name: 'title', label: 'Section Title', required: true }),
    richTextField({ name: 'description', label: 'Description' }),
    uploadField('image', { required: true, label: 'Contact Image' }),
    textField({
      name: 'whatsappNumber',
      label: 'WhatsApp Number (digits only, no +)',
      required: true,
      defaultValue: '6282340875650',
    }),
    textField({
      name: 'submitLabel',
      label: 'Submit Button Label',
      required: true,
      defaultValue: 'Summon a signal',
    }),
  ],
} satisfies Block
