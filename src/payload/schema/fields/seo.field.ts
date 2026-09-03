import type { Field } from 'payload'
import { uploadField } from './upload.field'

export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Keywords',
      admin: {
        description: 'Comma-separated',
      },
    },
    uploadField('og_image', { label: 'OG Image' }),
  ],
}
