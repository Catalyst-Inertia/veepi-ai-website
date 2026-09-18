import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Block } from 'payload'
import {
  arrayField,
  identifierField,
  richTextField,
  sectionIdField,
  textField,
} from '../../fields'

// Spec item 3: block slugs use the lowercase block-<name> convention.
// Exported so the renderer can type blockType via typeof IDENTIFIER (single
// source of truth for the slug — components never duplicate the literal).
export const IDENTIFIER = 'block-faq' as const

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(__dirname, 'thumbnail.webp'),
  'base64',
)}`

export const BlockFaqBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockFaqBlock',
  admin: {
    images: {
      thumbnail: {
        // TODO: replace thumbnail.webp with a block-specific image (3:2, e.g. 600x400)
        url: thumbnailUrl,
        alt: 'BlockFaq block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('faq'),
    textField({ name: 'title', label: 'Title', required: true }),
    arrayField({
      name: 'questions',
      label: 'Questions',
      fields: [
        textField({ name: 'question', label: 'Question', required: true }),
        richTextField({ name: 'answer', label: 'Answer' }),
      ],
    }),
  ],
} satisfies Block
