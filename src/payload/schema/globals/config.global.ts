import type { GlobalConfig } from 'payload'

import { groupField, dateField, uiField } from '../fields'

export const config: GlobalConfig = {
  slug: 'config',
  label: 'Config',
  fields: [
    groupField({
      name: 'cache',
      label: 'Cache / Revalidate',
      fields: [
        dateField({
          name: 'lastRevalidatedAt',
          label: 'Last Full Revalidation',
          admin: {
            readOnly: true,
          },
        }),
        uiField({
          name: 'revalidateControls',
          label: 'Revalidation Controls',
          admin: {
            components: {
              Field:
                '/src/payload/components/revalidate-controls#RevalidateControls',
            },
          },
        }),
      ],
    }),
  ],
}
