import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import {
  identifierField,
  textField,
  richTextField,
  relationshipField,
  arrayField,
  uploadField,
  actionButtonField,
} from '../../fields'

// Exported so the renderer types blockType via typeof IDENTIFIER (single
// source of truth for the slug).
export const IDENTIFIER = 'block-home-portfolio' as const

const thumbnailUrl = `data:image/webp;base64,${readFileSync(
  join(
    process.cwd(),
    'src/payload/schema/blocks/block-home-portfolio/thumbnail.webp',
  ),
  'base64',
)}`

export const BlockHomePortfolioBlock = {
  slug: IDENTIFIER,
  interfaceName: 'BlockHomePortfolioBlock',
  admin: {
    images: {
      thumbnail: {
        // Screenshot of the rendered homepage case-studies section (3:2).
        url: thumbnailUrl,
        alt: 'HomePortfolio block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    textField({ name: 'title', label: 'Section Title', required: true }),
    richTextField({ name: 'description', label: 'Description' }),
    // The case studies render from the array rows in editor order. Payload
    // arrays are drag-reorderable in the admin UI, so the order here IS the
    // display order. Empty falls back to the projects feed (/works, then
    // legacy /projects) — see getSelectedCaseStudyPosts / getCaseStudiesPosts
    // in src/cms/data/action.ts.
    arrayField({
      name: 'posts',
      label: 'Case Studies',
      minRows: 2,
      maxRows: 2,
      description:
        'Pick the posts shown here, in display order (drag to reorder rows). Up to 2. Leave empty to use the default projects feed.',
      fields: [
        relationshipField({
          name: 'post',
          label: 'Post',
          relationTo: 'posts',
          required: true,
        }),
      ],
    }),
    actionButtonField(),
    uploadField('viewMoreImage', {
      required: true,
      label: 'View More Image',
    }),
  ],
} satisfies Block
