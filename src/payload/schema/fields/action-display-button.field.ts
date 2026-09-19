import type { Field, GroupField } from 'payload'
import { groupField } from './group.field'
import { textField } from './text.field'
import { selectField } from './select.field'

type Options = {
  name?: string
  label?: string
  description?: string
  required?: boolean
  admin?: GroupField['admin']
}

/**
 * A simplified button field that only configures presentation attributes
 * (label and variant) without any link or page routing capabilities.
 * Use this when the button's action is hardcoded in the component
 * (e.g. opening a specific modal or form).
 */
export const actionDisplayButtonField = (options: Options = {}): Field =>
  groupField({
    name: options.name ?? 'actionButton',
    label: options.label ?? 'Action Button',
    description: options.description,
    required: options.required,
    admin: options.admin,
    fields: [
      textField({
        name: 'label',
        label: 'Label',
        required: true,
      }),
      selectField({
        name: 'variant',
        label: 'Variant',
        defaultValue: 'primary',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
        ],
      }),
    ],
  })
