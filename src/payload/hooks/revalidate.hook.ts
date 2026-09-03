// Auto-revalidation hooks for pages, posts, groups, and the header/footer
// globals. Attached in the collection/global configs; must never throw into
// the save flow, so every hook wraps its work in try/catch + logger.

import { invalidatePath, invalidateTag } from '@/cms/revalidate/emit'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
} from 'payload'
import { CACHE_TAGS, pagePublicPath, postPublicPath } from '@/cms/data/tags'

// next/cache's revalidate* APIs only work inside a Next.js server runtime
// (request/render context). The payload CLI, migrations, and seed scripts run
// without a static-generation store, so calling them throws. Revalidation is
// pointless there — no ISR cache exists to bust — so skip it entirely.
const canRevalidate =
  process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge'

type HookDoc = {
  id?: string
  slug?: unknown
  isHomepage?: boolean | null
  prefix?: unknown
  group?: unknown
}

const resolveGroupPrefix = async (
  payload: Payload,
  doc: HookDoc,
): Promise<string | null> => {
  const group = doc.group
  if (typeof group === 'string') {
    const resolved = await payload.findByID({
      collection: 'groups',
      id: group,
      depth: 0,
    })
    return typeof resolved?.prefix === 'string' ? resolved.prefix : null
  }
  if (
    group !== null &&
    typeof group === 'object' &&
    typeof (group as { prefix?: unknown }).prefix === 'string'
  ) {
    return (group as { prefix: string }).prefix
  }
  return null
}

// pages — afterChange + afterDelete
const revalidatePageDoc = async (
  _payload: Payload,
  doc: HookDoc,
  oldSlug?: string,
): Promise<void> => {
  if (!canRevalidate) return
  if (typeof doc.slug !== 'string' || doc.slug.length === 0) return
  invalidateTag(CACHE_TAGS.page(doc.slug))
  invalidateTag(CACHE_TAGS.collection.pages)
  invalidatePath(pagePublicPath({ slug: doc.slug, isHomepage: doc.isHomepage }))
  if (oldSlug && oldSlug !== doc.slug) {
    invalidateTag(CACHE_TAGS.page(oldSlug))
    // Old slug has no isHomepage info; if the renamed page was the
    // homepage, the root route refreshes via the collection tag (and the
    // next getHomepageData fetch) within the cache window.
    invalidatePath(pagePublicPath({ slug: oldSlug }))
  }
}

export const revalidatePage: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  try {
    // Skip unpublished saves (e.g. draft autosaves): only published content
    // should invalidate caches. No-op while drafts are disabled (_status is
    // absent then).
    if (doc._status && doc._status !== 'published') return
    const oldSlug =
      typeof previousDoc?.slug === 'string' ? previousDoc.slug : undefined
    await revalidatePageDoc(req.payload, doc, oldSlug)
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'revalidatePage afterChange hook failed',
    })
  }
}

export const revalidatePageAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  try {
    await revalidatePageDoc(req.payload, doc)
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'revalidatePage afterDelete hook failed',
    })
  }
}

// posts — afterChange + afterDelete (also busts the group + collection tags)
type RevalidatePostOld = {
  oldSlug?: string
  oldPrefix?: string
}

const revalidatePostDoc = async (
  payload: Payload,
  doc: HookDoc,
  old: RevalidatePostOld = {},
): Promise<void> => {
  if (!canRevalidate) return
  if (typeof doc.slug !== 'string' || doc.slug.length === 0) return
  const { oldSlug, oldPrefix } = old
  const prefix = await resolveGroupPrefix(payload, doc)
  invalidateTag(CACHE_TAGS.post(doc.slug))
  invalidateTag(CACHE_TAGS.collection.posts)
  invalidateTag(CACHE_TAGS.collection.groups)
  if (prefix) {
    invalidateTag(CACHE_TAGS.group(prefix))
    invalidatePath(postPublicPath(prefix, doc.slug))
  }
  if (oldSlug && oldSlug !== doc.slug) {
    invalidateTag(CACHE_TAGS.post(oldSlug))
    const oldPathPrefix = oldPrefix ?? prefix
    if (oldPathPrefix) {
      invalidatePath(postPublicPath(oldPathPrefix, oldSlug))
    }
  }
  if (oldPrefix && oldPrefix !== prefix) {
    invalidateTag(CACHE_TAGS.group(oldPrefix))
  }
}

export const revalidatePost: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  try {
    // Skip unpublished saves (e.g. draft autosaves): only published content
    // should invalidate caches. No-op while drafts are disabled (_status is
    // absent then).
    if (doc._status && doc._status !== 'published') return
    const oldSlug =
      typeof previousDoc?.slug === 'string' ? previousDoc.slug : undefined
    const oldPrefix =
      (await resolveGroupPrefix(req.payload, previousDoc ?? {})) ?? undefined
    await revalidatePostDoc(req.payload, doc, { oldSlug, oldPrefix })
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'revalidatePost afterChange hook failed',
    })
  }
}

export const revalidatePostAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  try {
    await revalidatePostDoc(req.payload, doc)
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'revalidatePost afterDelete hook failed',
    })
  }
}

// groups — afterChange + afterDelete (busts the group tag + every member post)
const revalidateGroupDoc = async (
  payload: Payload,
  doc: HookDoc,
  oldPrefix?: string,
): Promise<void> => {
  if (!canRevalidate) return
  if (typeof doc.prefix !== 'string' || doc.prefix.length === 0) return
  const prefix = doc.prefix
  invalidateTag(CACHE_TAGS.group(prefix))
  invalidateTag(CACHE_TAGS.collection.groups)
  invalidatePath(prefix)

  // Paginate through every member post (a group can hold more than one page
  // of posts; `limit: 1000` would silently drop the rest).
  let page = 1
  let hasNext = true
  while (hasNext) {
    const postsResult = await payload.find({
      collection: 'posts',
      where: { group: { equals: doc.id as string } },
      limit: 100,
      page,
      depth: 0,
    })
    for (const post of postsResult.docs) {
      invalidateTag(CACHE_TAGS.post(post.slug))
      invalidatePath(postPublicPath(prefix, post.slug))
      if (oldPrefix && oldPrefix !== prefix) {
        invalidatePath(postPublicPath(oldPrefix, post.slug))
      }
    }
    hasNext = postsResult.hasNextPage
    page += 1
  }

  if (oldPrefix && oldPrefix !== prefix) {
    invalidateTag(CACHE_TAGS.group(oldPrefix))
    invalidatePath(oldPrefix)
  }
}

export const revalidateGroup: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  try {
    // Skip unpublished saves (e.g. draft autosaves): only published content
    // should invalidate caches. No-op while drafts are disabled (_status is
    // absent then).
    if (doc._status && doc._status !== 'published') return
    const oldPrefix =
      typeof previousDoc?.prefix === 'string' ? previousDoc.prefix : undefined
    await revalidateGroupDoc(req.payload, doc, oldPrefix)
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'revalidateGroup afterChange hook failed',
    })
  }
}

export const revalidateGroupAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  try {
    await revalidateGroupDoc(req.payload, doc)
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'revalidateGroup afterDelete hook failed',
    })
  }
}

// Globals — header/footer affect every page, so bust the layout + the global tag.
export const revalidateGlobal =
  (globalSlug: 'header' | 'footer'): GlobalAfterChangeHook =>
  async ({ req }) => {
    if (!canRevalidate) return
    try {
      invalidatePath('/', 'layout')
      invalidateTag(CACHE_TAGS.global[globalSlug])
    } catch (err) {
      req.payload.logger.error({
        err,
        msg: `revalidateGlobal (${globalSlug}) afterChange hook failed`,
      })
    }
  }
