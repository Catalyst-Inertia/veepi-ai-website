import type { GlobalConfig } from 'payload'

import {
  uploadField,
  groupLinkField,
  linkField,
  textField,
  richTextField,
  checkboxField,
  arrayField,
  groupField,
  selectField,
} from '../fields'
import { revalidateGlobal } from '../../hooks/revalidate.hook'

export const footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  hooks: {
    afterChange: [revalidateGlobal('footer')],
  },
  fields: [
    uploadField('logo', { label: 'Logo' }),
    uploadField('background', { label: 'Background Image' }),
    groupLinkField({
      name: 'links',
      label: 'Links',
      description: 'Footer links: internal Page/Post or external URL.',
    }),
    arrayField({
      name: 'socials',
      label: 'Socials',
      fields: [
        selectField({
          name: 'platform',
          label: 'Platform',
          options: [
            { label: 'X', value: 'x' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
          ],
        }),
        linkField({
          name: 'link',
          label: 'Link',
          description:
            'Social profile link (usually external, e.g. https://instagram.com/…). Label is used as accessibility text.',
        }),
      ],
    }),
    textField({ name: 'copyright', label: 'Copyright' }),
    textField({ name: 'heading', label: 'Heading' }),
    richTextField({ name: 'intro', label: 'Intro Paragraph' }),
    checkboxField({
      name: 'showCta',
      label: 'Show Call to Action',
      defaultValue: true,
      admin: {
        description: 'Uncheck to hide the call-to-action button entirely.',
      },
    }),
    linkField({
      name: 'cta',
      label: 'Call to Action',
      admin: {
        condition: (_, siblingData) => siblingData?.showCta !== false,
        description:
          'Footer call-to-action link: internal Page/Post or external URL.',
      },
    }),
    groupField({
      name: 'sectionLabels',
      label: 'Column Titles',
      fields: [
        textField({ name: 'links', label: 'Links Column Title' }),
        textField({ name: 'contact', label: 'Contact Column Title' }),
      ],
    }),
    arrayField({
      name: 'contact',
      label: 'Contact Details',
      fields: [
        selectField({
          name: 'icon',
          label: 'Icon',
          required: true,
          options: [
            { label: 'Phone', value: 'phone' },
            { label: 'Mail', value: 'mail' },
            { label: 'Location', value: 'location' },
          ],
        }),
        textField({ name: 'label', label: 'Label', required: true }),
      ],
    }),
  ],
}
