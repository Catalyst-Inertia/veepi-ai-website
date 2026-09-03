import type { JoinField } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
} & Omit<JoinField, 'type'>

/**
 * Join field wrapper. `collection` and `on` are required in options; every
 * other payload `JoinField` prop passes through via the typed Omit.
 * `description` maps to `admin.description`.
 */
export const joinField = (options: Options): JoinField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'join',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
  }
}
