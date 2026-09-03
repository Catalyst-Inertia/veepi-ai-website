import type { GlobalConfig } from 'payload'

import {
  uploadField,
  groupLinkField,
  linkField,
  checkboxField,
} from '../fields'
import { revalidateGlobal } from '../../hooks/revalidate.hook'

export const header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  hooks: {
    afterChange: [revalidateGlobal('header')],
  },
  fields: [
    uploadField('logo', { label: 'Logo' }),
    groupLinkField({
      name: 'nav',
      label: 'Navigation',
      description:
        'Navigation links: pick an internal Page or Post, or enter an external URL.',
    }),
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
          'Primary call-to-action link: internal Page/Post or external URL.',
      },
    }),
  ],
}
