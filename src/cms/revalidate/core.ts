// Shared revalidation logic. No auth here — callers decide the gate:
// - src/cms/revalidate/action.ts (server action, Payload-admin auth)
// - app/(frontend)/revalidate/route.ts (external secret auth)

import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  CACHE_TAGS,
  normalizePrefix,
  pagePublicPath,
  postPublicPath,
} from '@/cms/data/tags'

export type RevalidateCollection = 'pages' | 'posts' | 'groups'

export type RevalidateSingleTarget = {
  collection: RevalidateCollection
  /** pages/posts: document slug. groups: the group URL prefix (e.g. `/projects`). */
  slug: string
  /** posts only: group URL prefix (leading slash optional). */
  prefix?: string
}

const getPayloadClient = () => getPayload({ config })

export async function revalidateSingle({
  collection,
  slug,
  prefix,
}: RevalidateSingleTarget): Promise<void> {
  const payload = await getPayloadClient()

  if (collection === 'pages') {
    revalidateTag(CACHE_TAGS.page(slug))
    revalidateTag(CACHE_TAGS.collection.pages)
    const page = (
      await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
      })
    ).docs[0]
    // Homepage path depends on the isHomepage flag; when the doc is gone,
    // invalidate the raw slug path so 404 caches refresh too.
    revalidatePath(page ? pagePublicPath(page) : `/${slug}`)
    return
  }

  if (collection === 'posts') {
    if (!prefix) {
      throw new Error('prefix is required when revalidating posts')
    }
    const groupPrefix = normalizePrefix(prefix)
    revalidateTag(CACHE_TAGS.post(slug))
    revalidateTag(CACHE_TAGS.collection.posts)
    revalidateTag(CACHE_TAGS.group(groupPrefix))
    revalidateTag(CACHE_TAGS.collection.groups)
    revalidatePath(postPublicPath(groupPrefix, slug))
    return
  }

  // groups: `slug` carries the group prefix
  const groupPrefix = normalizePrefix(slug)
  revalidateTag(CACHE_TAGS.group(groupPrefix))
  revalidateTag(CACHE_TAGS.collection.groups)

  const groupResult = await payload.find({
    collection: 'groups',
    where: { prefix: { equals: groupPrefix } },
    limit: 1,
    depth: 0,
  })
  const group = groupResult.docs[0]
  if (group) {
    const postsResult = await payload.find({
      collection: 'posts',
      where: { group: { equals: group.id } },
      limit: 1000,
      depth: 0,
    })
    for (const post of postsResult.docs) {
      revalidateTag(CACHE_TAGS.post(post.slug))
      revalidatePath(postPublicPath(groupPrefix, post.slug))
    }
  }
}

export async function revalidateAll(): Promise<void> {
  const payload = await getPayloadClient()

  // Layout re-render busts header/footer (they render in the layout) plus
  // every route that includes the layout.
  revalidatePath('/', 'layout')
  revalidateTag(CACHE_TAGS.collection.pages)
  revalidateTag(CACHE_TAGS.collection.posts)
  revalidateTag(CACHE_TAGS.collection.groups)
  revalidateTag(CACHE_TAGS.global.header)
  revalidateTag(CACHE_TAGS.global.footer)
  revalidateTag(CACHE_TAGS.global.config)

  await payload.updateGlobal({
    slug: 'config',
    data: {
      cache: {
        lastRevalidatedAt: new Date().toISOString(),
      },
    },
  })
}
