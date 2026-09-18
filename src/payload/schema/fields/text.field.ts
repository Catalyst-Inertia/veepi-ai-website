import type { TextField } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
} & Omit<TextField, 'type'>

/**
 * Text field wrapper. `description` maps to `admin.description`; every other
 * payload `TextField` prop (unique, hooks, validate, defaultValue, admin, …)
 * passes through via the typed Omit.
 */
export const textField = (options: Options): TextField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'text',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
    // TextField is a hasMany-discriminated union; spreading the collapsed
    // optional props widens hasMany/validate beyond any single variant, so
    // assert the constructed literal back to the payload type.
  } as TextField
}
