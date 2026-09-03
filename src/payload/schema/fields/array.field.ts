import type { ArrayField, Field } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
  fields: Field[]
} & Omit<ArrayField, 'type'>

/**
 * Array (repeater) field wrapper. `fields` is required in options — array
 * rows are composed from (wrapper-built) sub-fields. `description` maps to
 * `admin.description`; every other payload `ArrayField` prop passes through
 * via the typed Omit.
 */
export const arrayField = (options: Options): ArrayField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'array',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
  }
}
