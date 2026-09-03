import type { CollectionConfig } from 'payload'
import { textField, joinField } from '../fields'
import {
  revalidateGroup,
  revalidateGroupAfterDelete,
} from '../../hooks/revalidate.hook'
import { validateGroupPrefixAgainstPages } from './route-collision'

export const Groups: CollectionConfig = {
  slug: 'groups',
  admin: {
    group: 'CMS',
    useAsTitle: 'name',
    defaultColumns: ['name', 'prefix'],
  },
  hooks: {
    afterChange: [revalidateGroup],
    afterDelete: [revalidateGroupAfterDelete],
  },
  fields: [
    textField({ name: 'name', label: 'Name', required: true }),
    textField({
      name: 'prefix',
      label: 'URL Prefix',
      required: true,
      unique: true,
      admin: {
        description:
          'Single path segment only (e.g. /projects). Multi-segment prefixes make posts unreachable.',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value !== 'string' || value.length === 0) {
              return value
            }
            let result = value.trim()
            if (!result.startsWith('/')) {
              result = '/' + result
            }
            result = result.replace(/\/+$/, '')
            return result.toLowerCase()
          },
        ],
      },
      validate: validateGroupPrefixAgainstPages,
    }),
    joinField({
      name: 'posts',
      collection: 'posts',
      on: 'group',
      label: 'Posts',
    }),
  ],
}
