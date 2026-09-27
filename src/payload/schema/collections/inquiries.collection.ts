import type { CollectionConfig } from 'payload'
import { groupField, dateField, textField, selectField } from '../fields'
import { CONTACT_CONTENT_TYPE_OPTIONS } from '@/cms/inquiries/options'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  defaultSort: 'metadata.formType',
  admin: {
    defaultColumns: [
      'metadata.formType',
      'submission.fullName',
      'submission.email',
      'metadata.submittedAt',
      'metadata.originPath',
    ],
    components: {
      listMenuItems: [
        '/src/payload/components/form-type-filter#FormTypeFilter',
      ],
    },
    description:
      'Submissions are created via the public API (contact form popup and footer newsletter form).',
    listSearchableFields: ['submission.email', 'submission.fullName'],
  },
  access: {
    create: () => true,
    read: ({ req }) => req.user != null,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    groupField({
      name: 'submission',
      label: 'Submission',
      fields: [
        textField({
          name: 'fullName',
          label: 'Full Name',
          admin: { readOnly: true },
          required: false,
        }),
        textField({
          name: 'email',
          label: 'Email',
          admin: { readOnly: true },
          required: false,
        }),
        textField({
          name: 'practice',
          label: 'Practice',
          admin: { readOnly: true },
          required: false,
        }),
        textField({
          name: 'role',
          label: 'Role',
          admin: { readOnly: true },
          required: false,
        }),
        selectField({
          name: 'contentTypes',
          label: 'Content Types',
          hasMany: true,
          // SAFETY: Payload options type is mutable, but our options are defined as readonly `as const`
          options: CONTACT_CONTENT_TYPE_OPTIONS as unknown as {
            label: string
            value: string
          }[],
          admin: { readOnly: true },
          required: false,
        }),
      ],
    }),
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
        selectField({
          name: 'formType',
          label: 'Form Type',
          options: [
            { label: 'Contact Form', value: 'contact-popup' },
            { label: 'Newsletter', value: 'newsletter' },
          ],
        }),
      ],
    }),
  ],
}
