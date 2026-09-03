import { randomUUID } from 'node:crypto'
import type { Field } from 'payload'

export const SECTION_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const SECTION_ID_ERROR =
  'Section ID must be lowercase letters, numbers, or hyphens (e.g. project-cta)'

type Options = {
  label?: string
  description?: string
}

/**
 * Reusable section anchor field (spec: block anchor support).
 *
 * Every block exposes an editable `sectionId`. A default is auto-generated
 * from the block name plus a random suffix on create; editors can override
 * it in the admin. The renderer resolves the final ID and guarantees
 * uniqueness within a page. The field NAME is fixed (`sectionId`) — the
 * renderer and link section-picker read it by name — but `label` /
 * `description` are overridable.
 */
export const sectionIdField = (
  blockName: string,
  options: Options = {},
): Field => {
  const slug = blockName.toLowerCase()
  const {
    label = 'Section ID (anchor)',
    description = 'Unique anchor for this section. Auto-generated, but you can override it.',
  } = options

  return {
    name: 'sectionId',
    type: 'text',
    label,
    defaultValue: () => `${slug}-${randomUUID().slice(0, 8)}`,
    admin: {
      description,
      placeholder: `${slug}-abc12345`,
    },
    validate: (value: string | string[] | null | undefined) => {
      if (value == null || value === '') return true
      if (typeof value !== 'string') return 'Section ID must be a string'
      if (!SECTION_ID_PATTERN.test(value)) return SECTION_ID_ERROR
      return true
    },
  }
}
