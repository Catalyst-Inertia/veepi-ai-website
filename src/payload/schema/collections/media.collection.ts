import type { CollectionConfig } from 'payload'
import { textField } from '../fields'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Site images plus the homepage/video block media (mp4 source + webm
    // delivery). Everything else is rejected at upload time.
    mimeTypes: ['image/*', 'image/svg+xml', 'video/mp4', 'video/webm'],
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    textField({ name: 'alt', label: 'Alt Text', required: true }),
    textField({ name: 'caption', label: 'Caption' }),
  ],
}
