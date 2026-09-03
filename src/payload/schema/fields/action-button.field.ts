import type { Field, GroupField } from 'payload'
import { linkFields } from './link.field'
import { groupField } from './group.field'
import { selectField } from './select.field'

type Options = {
  name?: string
  label?: string
  description?: string
  required?: boolean
  admin?: GroupField['admin']
}

/**
 * Styled CTA button composed from the reusable `linkFields` primitive
 * (internal/external navigation + target) plus a presentation `variant`.
 *
 * `linkFields` provides label, type, internalUrl, externalUrl, target,
 * and the resolved virtual fields url + newTab — so renderers get a
 * predictable shape without re-implementing route resolution.
 *
 * Wrapper factory like every other field: `name` (default `actionButton`)
 * and `label` (default `Action Button`) are configurable per block so
 * multiple CTA buttons can coexist with distinct field names.
 */
export const actionButtonField = (options: Options = {}): Field =>
  groupField({
    name: options.name ?? 'actionButton',
    label: options.label ?? 'Action Button',
    description: options.description,
    required: options.required,
    admin: options.admin,
    fields: [
      ...linkFields,
      selectField({
        name: 'variant',
        label: 'Variant',
        defaultValue: 'primary',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Link', value: 'link' },
        ],
      }),
    ],
  })
