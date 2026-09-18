import type { DateField } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
} & Omit<DateField, 'type'>

/**
 * Date field wrapper. `description` maps to `admin.description`; every other
 * payload `DateField` prop (defaultValue, admin, …) passes through via the
 * typed Omit.
 */
export const dateField = (options: Options): DateField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'date',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
  }
}
