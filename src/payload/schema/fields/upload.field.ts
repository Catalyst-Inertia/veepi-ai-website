import type { UploadField } from 'payload'

type Options = {
  label?: string
  required?: boolean
  description?: string
} & Omit<UploadField, 'type' | 'name' | 'relationTo' | 'label' | 'required'>

/**
 * Upload field wrapper pinned to the `media` collection. `description` maps
 * to `admin.description`; every other payload `UploadField` prop passes
 * through via the typed Omit.
 */
export const uploadField = (
  name: string = 'image',
  options: Options = {},
): UploadField => {
  const { label, description, admin, ...rest } = options
  return {
    ...rest,
    name,
    type: 'upload',
    relationTo: 'media',
    required: options.required ?? false,
    label: label ?? 'Image',
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
    // UploadField is a hasMany-discriminated union; see text.field.ts.
  } as UploadField
}
