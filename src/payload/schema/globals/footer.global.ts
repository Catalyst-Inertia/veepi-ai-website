import type { GlobalConfig } from 'payload'

import {
  uploadField,
  groupLinkField,
  linkField,
  textField,
  richTextField,
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
    groupField({
      name: 'subscribe',
      label: 'Subscription Form',
      fields: [
        textField({ name: 'placeholder', label: 'Input Placeholder' }),
        textField({ name: 'buttonLabel', label: 'Button Label' }),
        textField({ name: 'note', label: 'Note Under Form' }),
      ],
    }),
  ],
}
