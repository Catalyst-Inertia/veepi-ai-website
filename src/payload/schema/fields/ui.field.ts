import type { UIField } from 'payload'

type Options = {
  name: string
  label: string
} & Omit<UIField, 'type'>

/**
 * UI field wrapper — a vessel for rendering custom admin components.
 * `admin` is required (the payload `UIField` contract) and passes through
 * via the typed Omit. No `description` support: UIField admin has none.
 */
export const uiField = (options: Options): UIField => {
  const { admin, ...rest } = options
  return {
    ...rest,
    type: 'ui',
    admin,
  }
}
