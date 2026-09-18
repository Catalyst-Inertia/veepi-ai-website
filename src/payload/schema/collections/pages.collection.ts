import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'
import { remapLegacyBlockSlugs } from '../blocks/legacy-slugs'
import { checkboxField, seoField, textField, blocksField } from '../fields'
import { validatePageSlugAgainstGroups } from './route-collision'
import {
  revalidatePage,
  revalidatePageAfterDelete,
} from '../../hooks/revalidate.hook'
import { generatePreviewPath } from '../../preview/url'

// Single-segment only: multi-segment slugs are unreachable — the route
// resolver treats 2-segment paths as post (prefix, slug), never pages.
const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

/**
 * Homepage is decided by the `isHomepage` flag, not by convention on the
 * slug (a page can keep slug `homepage` or use any other slug). Exactly one
 * page may carry the flag: setting it here clears it from every other page,
 * so reassignment is a single checkbox click instead of a two-step dance.
 * NOT a unique index — a boolean unique index would also cap the number of
 * `false` rows.
 */
const ensureSingleHomepage: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (data?.isHomepage !== true) return data
  const ownId =
    originalDoc && typeof originalDoc === 'object' && 'id' in originalDoc
      ? originalDoc.id
      : undefined
  await req.payload.update({
    collection: 'pages',
    // On create there is no own id yet — clear every page so the new doc is
    // the sole homepage.
    where: typeof ownId === 'string' ? { id: { not_equals: ownId } } : {},
    data: { isHomepage: false },
    overrideAccess: true,
  })
  return data
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'CMS',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    preview: ({ slug }, { req }) =>
      generatePreviewPath({
        collection: 'pages',
        data: { slug },
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
    beforeChange: [ensureSingleHomepage],
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageAfterDelete],
  },
  fields: [
    textField({ name: 'title', label: 'Title', required: true }),
    checkboxField({
      name: 'isHomepage',
      label: 'Homepage',
      description:
        'Marks this page as the site homepage (served at /). Only one page can be the homepage; checking it clears the flag on every other page.',
      admin: {
        position: 'sidebar',
      },
    }),
    textField({
      name: 'slug',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.length > 0)
              return formatSlug(value)
            if (data?.title) return formatSlug(data.title)
            return value
          },
        ],
      },
      validate: validatePageSlugAgainstGroups,
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
