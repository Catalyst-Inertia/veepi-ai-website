import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'

import { collections } from './src/payload/schema/collections'
import { globals } from './src/payload/schema/globals'
import { buildPreviewUrl, generatePreviewPath } from './src/payload/preview/url'
import { SERVER_URL } from './src/cms/origin'

const secret = process.env.PAYLOAD_SECRET
if (!secret) {
  throw new Error('PAYLOAD_SECRET environment variable is required')
}

export default buildConfig({
  serverURL: SERVER_URL,
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  admin: {
    // Draft-preview buttons are wired per-collection (pages, posts) via
    // `admin.preview` — v3 has no root-level `admin.preview`.
    livePreview: {
      collections: ['pages', 'posts'],
      globals: ['header', 'footer'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      url: ({ data, collectionConfig, globalConfig, payload }) => {
        // Globals render on every page via the frontend layout; no drafts, so
        // the iframe loads a dedicated layout-only route that works even when
        // no homepage page exists yet.
        if (globalConfig) {
          // Route through /preview so draft mode is enabled (secret-checked)
          // before the layout-only globals route renders draft header/footer.
          return buildPreviewUrl('/preview/globals')
        }
        return generatePreviewPath({
          collection: collectionConfig?.slug,
          data,
          payload,
        })
      },
    },
  },

  // Define and configure your collections in this array
  collections,
  globals,

  // Your Payload secret - should be a complex and secure string, unguessable
  secret,
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
    // Required: unique:true / index:true fields only become real DB indexes when ensured.
    ensureIndexes: true,
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
  typescript: {
    outputFile: 'src/payload-types.ts',
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename }) => {
            const bucket = process.env.S3_BUCKET || ''
            const region = process.env.S3_REGION || 'us-east-1'
            const endpoint = process.env.S3_ENDPOINT
            if (endpoint) {
              return `${endpoint}/${bucket}/${filename}`
            }
            return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT || undefined,
      },
    }),
  ],
})
