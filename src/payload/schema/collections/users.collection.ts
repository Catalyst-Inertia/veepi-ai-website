import type { CollectionConfig } from 'payload'
import { textField } from '../fields'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Admin needs read access to users to function; no roles beyond admin auth
    read: () => true,
  },
  fields: [textField({ name: 'name', label: 'Name', required: true })],
}
