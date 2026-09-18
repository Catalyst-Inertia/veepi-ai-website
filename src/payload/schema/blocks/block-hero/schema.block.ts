import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Block } from 'payload'
import {
  identifierField,
  sectionIdField,
  richTextField,
  uploadField,
  arrayField,
  selectField,
  actionButtonField,
} from '../../fields'

// Exported so the renderer types blockType via typeof IDENTIFIER (single
// source of truth for the slug).
export const IDENTIFIER = 'block-hero' as const

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(__dirname, 'thumbnail.webp'),
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
    arrayField({
      name: 'animatedTexts',
      label: 'Animated Texts',
      fields: [
        selectField({
          name: 'textStyle',
          label: 'Text Style',
          options: [
            { label: 'Heading (Large Serif)', value: 'heading' },
            { label: 'Description (Small Sans)', value: 'description' },
          ],
          defaultValue: 'heading',
          required: true,
        }),
        richTextField({ name: 'text', label: 'Content' }),
      ],
    }),
    richTextField({ name: 'description', label: 'Description' }),
    arrayField({
      name: 'logos',
      label: 'Logos',
      fields: [uploadField('logo', { label: 'Logo', required: true })],
    }),
    actionButtonField({ name: 'cta', label: 'Call to Action' }),
  ],
} satisfies Block
