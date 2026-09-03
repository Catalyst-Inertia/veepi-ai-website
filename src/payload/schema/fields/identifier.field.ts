import type { Field } from 'payload'

type Options = {
  defaultValue?: string
  label?: string
  description?: string
}

/**
 * Block-type identifier field. Each block passes its own constant — e.g.
 * `const IDENTIFIER = 'MASTERHEAD'` — so the value distinguishes block types
 * in the data layer. The field NAME is fixed (`identifier`) — renaming it
 * would break the block-type discriminator, legacy slug remapping, and the
 * renderer — but `label`/`description` are overridable.
 *
 * Enforcement:
 * - admin.readOnly keeps it read-only in the admin UI;
 * - a field-level validate rejects any API-supplied value that differs from
 *   the block's constant (readOnly alone does not block API/local writes).
 * - null/undefined passes through, so pre-constant docs can still be saved.
 */
export const identifierField = (options: Options = {}): Field => {
  const {
    defaultValue,
    label = 'Identifier / Anchor ID',
    description = 'Block-type identifier — distinguishes this block from other block types.',
  } = options
  return {
    name: 'identifier',
    type: 'text',
    label,
    defaultValue,
    admin: {
      description,
      readOnly: true,
    },
    ...(defaultValue
      ? {
          validate: (value: string | string[] | null | undefined) => {
            if (value == null) return true
            if (typeof value !== 'string') return 'identifier must be a string'
            if (value !== defaultValue) {
              return `identifier must be "${defaultValue}" (block-type discriminator)`
            }
            return true
          },
        }
      : {}),
  }
}
