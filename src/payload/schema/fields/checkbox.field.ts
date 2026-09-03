import type { CheckboxField } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
} & Omit<CheckboxField, 'type'>

/**
 * Checkbox field wrapper. `description` maps to `admin.description`; every
 * other payload `CheckboxField` prop (defaultValue, admin, …) passes through
 * via the typed Omit.
 */
export const checkboxField = (options: Options): CheckboxField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'checkbox',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
  }
}
