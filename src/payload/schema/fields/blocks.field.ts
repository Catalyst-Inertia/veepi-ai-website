import type { Block, BlocksField } from 'payload'

type Options = {
  name: string
  label: string
  description?: string
  required?: boolean
  blocks: Block[]
} & Omit<BlocksField, 'type'>

/**
 * Blocks field wrapper. `blocks` is required in options; every other payload
 * `BlocksField` prop (hooks, admin, …) passes through via the typed Omit.
 * `description` maps to `admin.description`.
 */
export const blocksField = (options: Options): BlocksField => {
  const { description, admin, ...rest } = options
  return {
    ...rest,
    type: 'blocks',
    required: options.required ?? false,
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
  }
}
