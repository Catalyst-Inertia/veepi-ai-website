import type { Field, GroupField } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
  fields: Field[]
} & Omit<GroupField, 'type'>

/**
 * Group field wrapper. `fields` is required in options — groups are composed
 * from (wrapper-built) sub-fields. `description` maps to `admin.description`;
 * every other payload `GroupField` prop passes through via the typed Omit.
 */
export const groupField = (options: Options): GroupField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'group',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
  }
}
