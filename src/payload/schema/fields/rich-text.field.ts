import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { RichTextField } from 'payload'

type Options = {
  name?: string
  label?: string
  description?: string
} & Omit<RichTextField, 'type' | 'name' | 'label'>

/**
 * RichText field wrapper with the lexical editor pre-wired. Name and label
 * default to `content` / `Content`; `description` maps to `admin.description`;
 * every other payload `RichTextField` prop passes through via the typed Omit.
 */
export const richTextField = (options: Options = {}): RichTextField => {
  const {
    name = 'content',
    label = 'Content',
    description,
    admin,
    ...rest
  } = options
  return {
    ...rest,
    name,
    label,
    type: 'richText',
    editor: lexicalEditor(),
    ...(description || admin
      ? { admin: { ...(description ? { description } : {}), ...admin } }
      : {}),
  }
}
