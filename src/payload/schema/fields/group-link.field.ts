import type { ArrayField, Field } from 'payload'
import { linkFields } from './link.field'
import { arrayField } from './array.field'

/**
 * Reusable `groupLink` schema primitive (spec: groupLink field).
 *
 * Array repeater of the `link` fields — intended for scalable CMS surfaces
 * where a link list may grow later without changing downstream consumers.
 */
export const groupLinkField = (
  options: {
    name?: string
    label?: string
    required?: boolean
    description?: string
    admin?: ArrayField['admin']
  } = {},
): Field => {
  const {
    name = 'links',
    label = 'Links',
    required = false,
    description,
    admin,
  } = options
  return arrayField({
    name,
    label,
    required,
    ...(description ? { description } : {}),
    ...(admin ? { admin } : {}),
    fields: linkFields,
  })
}
