import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  PayloadRequest,
  Where,
} from 'payload'
import { allBlocks } from '../blocks'
import { remapLegacyBlockSlugs } from '../blocks/legacy-slugs'
import { seoField, textField, blocksField, relationshipField } from '../fields'
import {
  revalidatePost,
  revalidatePostAfterDelete,
} from '../../hooks/revalidate.hook'
import { generatePreviewPath } from '../../preview/url'

const groupIdOf = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value
  if (value !== null && typeof value === 'object' && 'id' in value) {
    const id = value.id
    if (typeof id === 'string') return id
  }
  return undefined
}

/**
 * F-08: a Post permanently belongs to the Group chosen at creation. Reject
 * group changes on update for every write path (Local API, REST, GraphQL,
 * imports, and scripts) — not just the admin UI. Export so smoke scripts can
 * attach the same guard to scratch collections.
 */
export const rejectPostGroupMove: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  if (operation !== 'update') return data
  const previousGroup = groupIdOf(originalDoc?.group)
  const nextGroup = groupIdOf(data?.group)
  if (previousGroup && nextGroup && previousGroup !== nextGroup) {
    throw new Error('A Post cannot be moved to another Group after creation')
  }
  return data
}

const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-/]+/g, '')
    .toLowerCase()

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'CMS',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'group', 'updatedAt'],
    // Spec item 5: default Payload list (group filtering via standard
    // collection filters) instead of the custom tree view.
    preview: (doc, { req }) =>
      generatePreviewPath({
        collection: 'posts',
        data: doc,
        payload: req.payload,
      }),
  },
  versions: {
    // DISABLED (spec item 6): drafts/autosave/schedulePublish stay off until
    // draft preview is verified end to end (preview surface, route
    // resolution, and revalidation all agree on "draft"). Re-enable only
    // after that validation passes.
    maxPerDoc: 25,
  },
  hooks: {
    beforeChange: [rejectPostGroupMove],
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostAfterDelete],
  },
  fields: [
    textField({ name: 'title', label: 'Title', required: true }),
    textField({
      name: 'slug',
      label: 'Slug',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.length > 0) {
              return formatSlug(value)
            }
            if (data?.title) {
              return formatSlug(data.title)
            }
            return value
          },
        ],
      },
      validate: async (
        value: string | string[] | null | undefined,
        {
          data,
          operation,
          req,
        }: {
          data?: { group?: unknown; id?: unknown } | null
          operation?: string
          req: PayloadRequest
        },
      ) => {
        if (typeof value !== 'string' || !value.trim() || !data?.group)
          return true
        const conditions: Where[] = [
          { slug: { equals: value } },
          { group: { equals: data.group } },
        ]
        if (operation === 'update' && data?.id) {
          conditions.push({ id: { not_equals: data.id } })
        }
        const existing = await req.payload.find({
          collection: 'posts',
          draft: true,
          depth: 0,
          limit: 1,
          where: { and: conditions },
        })
        if (existing.docs.length > 0) {
          return 'A post with this slug already exists in this group'
        }
        return true
      },
    }),
    relationshipField({
      name: 'group',
      label: 'Group',
      relationTo: 'groups',
      required: true,
      index: true,
      access: {
        // F-08: the Group is chosen once at creation. Deny field-level
        // updates so the admin selector renders read-only on edit; the
        // collection beforeChange hook enforces the same rule server-side.
        update: () => false,
      },
    }),
    seoField,
    blocksField({
      name: 'contents',
      label: 'Content',
      blocks: allBlocks,
      hooks: {
        afterRead: [
          // Legacy blockType remap (spec item 3 migration compat). Remove
          // once all stored content uses block-<name> slugs.
          ({ value }) => remapLegacyBlockSlugs(value),
        ],
      },
    }),
  ],
}
