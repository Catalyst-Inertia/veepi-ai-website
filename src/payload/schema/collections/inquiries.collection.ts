import type { CollectionConfig } from 'payload'
import { jsonField, groupField, dateField, textField } from '../fields'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    defaultColumns: ['metadata.submittedAt', 'metadata.originPath'],
    description:
      'Submissions are created via the public API. Creation is disabled in the admin UI (access control).',
  },
  access: {
    create: () => true,
    read: ({ req }) => req.user != null,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    jsonField({ name: 'submission', label: 'Submission', required: true }),
    groupField({
      name: 'metadata',
      label: 'Submission Metadata',
      fields: [
        dateField({
          name: 'submittedAt',
          label: 'Submitted At',
          required: true,
          defaultValue: () => new Date(),
        }),
        textField({ name: 'ip', label: 'IP Address' }),
        textField({ name: 'userAgent', label: 'User Agent' }),
        textField({ name: 'originPath', label: 'Origin Page Path' }),
      ],
    }),
  ],
}
