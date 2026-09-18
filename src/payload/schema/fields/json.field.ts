import type { JSONField } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
} & Omit<JSONField, 'type'>

/**
 * JSON field wrapper. `description` maps to `admin.description`; every other
 * payload `JSONField` prop passes through via the typed Omit.
 */
export const jsonField = (options: Options): JSONField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'json',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
  }
}
