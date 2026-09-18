import type { SelectField } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
} & Omit<SelectField, 'type'>

/**
 * Select field wrapper. `description` maps to `admin.description`; every other
 * payload `SelectField` prop (options, defaultValue, hasMany, admin, …) passes
 * through via the typed Omit.
 */
export const selectField = (options: Options): SelectField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'select',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
    // SelectField is a hasMany-discriminated union; see text.field.ts.
  } as SelectField
}
