import type { RelationshipField } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
} & Omit<RelationshipField, 'type'>

/**
 * Relationship field wrapper. `relationTo` is required in options; every other
 * payload `RelationshipField` prop (hasMany, filterOptions, admin, …) passes
 * through via the typed Omit. `description` maps to `admin.description`.
 */
export const relationshipField = (options: Options): RelationshipField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'relationship',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
    // RelationshipField is a hasMany-discriminated union; see text.field.ts.
  } as RelationshipField
}
