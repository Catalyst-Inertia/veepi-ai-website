import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Footer, Header, Page, Post } from '@/payload-types'
import { CACHE_TAGS, REVALIDATE_EXPIRE } from './tags'

const getPayloadClient = async () => getPayload({ config })

/**
 * Fetches the flagged homepage (pages.isHomepage === true). The flag is the
 * only homepage discriminator — the slug convention is not consulted, so a
 * missing homepage surfaces as null (route 404s) until a page is flagged.
 */
export async function getHomepageData({
  draft = false,
}: {
  draft?: boolean
} = {}): Promise<Page | null> {
  if (draft) {
    const result = await (
      await getPayloadClient()
    ).find({
      collection: 'pages',
      where: { isHomepage: { equals: true } },
      limit: 1,
      depth: 2,
      draft: true,
    })
    return result.docs[0] ?? null
  }

  const cached = unstable_cache(
    async () => {
      const result = await (
        await getPayloadClient()
      ).find({
        collection: 'pages',
        where: { isHomepage: { equals: true } },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    ['homepage'],
    {
      revalidate: REVALIDATE_EXPIRE,
      tags: [CACHE_TAGS.collection.pages],
    },
  )

  return cached()
}

export async function getPageData({
  slug,
  draft = false,
}: {
  slug: string
  draft?: boolean
}): Promise<Page | null> {
  if (draft) {
    const result = await (
      await getPayloadClient()
    ).find({
      collection: 'pages',
      // The flagged homepage is canonical at `/` only; it must not also be
      // fetchable by its slug (would duplicate it at `/about`).
      where: {
        and: [{ slug: { equals: slug } }, { isHomepage: { not_equals: true } }],
      },
      limit: 1,
      depth: 2,
      draft: true,
    })
    return result.docs[0] ?? null
  }

  const cached = unstable_cache(
    async (s: string) => {
      const result = await (
        await getPayloadClient()
      ).find({
        collection: 'pages',
        // Drafts disabled (spec item 6): every doc is published, so no
        // _status filter (the field no longer exists). Re-add when drafts
        // are re-enabled.
        where: {
          and: [{ slug: { equals: s } }, { isHomepage: { not_equals: true } }],
        },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    ['page', slug],
    {
      revalidate: REVALIDATE_EXPIRE,
      tags: [CACHE_TAGS.collection.pages, CACHE_TAGS.page(slug)],
    },
  )

  return cached(slug)
}

export async function getPostPageData({
  prefix,
  slug,
  draft = false,
}: {
  prefix: string
  slug: string
  draft?: boolean
}): Promise<Post | null> {
  const groupPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`

  if (draft) {
    const groupResult = await (
      await getPayloadClient()
    ).find({
      collection: 'groups',
      where: { prefix: { equals: groupPrefix } },
      limit: 1,
      depth: 0,
    })
    const group = groupResult.docs[0]
    if (!group) return null

    const postResult = await (
      await getPayloadClient()
    ).find({
      collection: 'posts',
      where: {
        and: [{ slug: { equals: slug } }, { group: { equals: group.id } }],
      },
      limit: 1,
      depth: 2,
      draft: true,
    })
    return postResult.docs[0] ?? null
  }

  const cached = unstable_cache(
    async (p: string, s: string) => {
      const groupResult = await (
        await getPayloadClient()
      ).find({
        collection: 'groups',
        where: { prefix: { equals: p } },
        limit: 1,
        depth: 0,
      })
      const group = groupResult.docs[0]
      if (!group) return null

      const postResult = await (
        await getPayloadClient()
      ).find({
        collection: 'posts',
        // Drafts disabled (spec item 6): every doc is published, so no
        // _status filter (the field no longer exists). Re-add when drafts
        // are re-enabled.
        where: {
          and: [{ slug: { equals: s } }, { group: { equals: group.id } }],
        },
        limit: 1,
        depth: 2,
      })
      return postResult.docs[0] ?? null
    },
    ['post', prefix, slug],
    {
      revalidate: REVALIDATE_EXPIRE,
      tags: [
        CACHE_TAGS.collection.posts,
        CACHE_TAGS.post(slug),
        CACHE_TAGS.collection.groups,
        CACHE_TAGS.group(groupPrefix),
      ],
    },
  )

  return cached(groupPrefix, slug)
}

const getGlobalData = async <T extends Header | Footer>(
  slug: 'header' | 'footer',
  draft: boolean,
): Promise<T> => {
  if (draft) {
    return (await getPayloadClient()).findGlobal({
      slug,
      depth: 1,
      draft: true,
    }) as Promise<T>
  }
  return unstable_cache(
    async () =>
      (await getPayloadClient()).findGlobal({
        slug,
        depth: 1,
      }) as Promise<T>,
    ['global', slug],
    {
      revalidate: REVALIDATE_EXPIRE,
      tags: [CACHE_TAGS.global[slug]],
    },
  )()
}

export const getHeaderData = (draft = false): Promise<Header> =>
  getGlobalData<Header>('header', draft)

export const getFooterData = (draft = false): Promise<Footer> =>
  getGlobalData<Footer>('footer', draft)

export type PublishedPage = { slug: string; isHomepage: boolean | null }

export const getAllPublishedPages = (): Promise<PublishedPage[]> =>
  unstable_cache(
    async () => {
      const res = await (
        await getPayloadClient()
      ).find({
        collection: 'pages',
        // Drafts disabled (spec item 6): every doc is published, so no
        // _status filter (the field no longer exists). Re-add when drafts
        // are re-enabled.
        limit: 1000,
        depth: 0,
      })
      return res.docs.map((d) => ({
        slug: d.slug,
        isHomepage: d.isHomepage ?? null,
      }))
    },
    ['all-published-pages'],
    {
      revalidate: REVALIDATE_EXPIRE,
      tags: [CACHE_TAGS.collection.pages],
    },
  )()

export const getAllPublishedPostPaths = (): Promise<
  { prefix: string; slug: string }[]
> =>
  unstable_cache(
    async () => {
      const res = await (
        await getPayloadClient()
      ).find({
        collection: 'posts',
        // Drafts disabled (spec item 6): every doc is published, so no
        // _status filter (the field no longer exists). Re-add when drafts
        // are re-enabled.
        limit: 1000,
        depth: 2,
      })
      return res.docs.flatMap((doc) => {
        const g = doc.group
        if (typeof g !== 'object' || g === null) return []
        // Legacy data can violate the prefix/slug contracts: a multi-segment
        // prefix (embedded '/' after the leading slash) or a missing slug would
        // leak invalid route parameters into static generation. Those docs are
        // surfaced and repaired by the migration scripts
        // (scripts/migrate-legacy-group-prefixes.ts,
        // scripts/migrate-invalid-posts.ts); this server module stays silent
        // and just skips them.
        if (typeof g.prefix !== 'string' || /^\/[^/]+\//.test(g.prefix))
          return []
        const slug = doc.slug
        if (typeof slug !== 'string' || slug.trim() === '') return []
        return [{ prefix: g.prefix.replace(/^\//, ''), slug }]
      })
    },
    ['all-published-post-paths'],
    {
      revalidate: REVALIDATE_EXPIRE,
      tags: [CACHE_TAGS.collection.posts, CACHE_TAGS.collection.groups],
    },
  )()

// Published posts in the group whose prefix matches `prefix` (e.g. the
// "/projects" case-studies feed). Two-step query: resolve the group by
// prefix, then fetch its published posts.
export const getPostsByGroupPrefix = (prefix: string): Promise<Post[]> =>
  unstable_cache(
    async (p: string) => {
      const payload = await getPayloadClient()
      const groupResult = await payload.find({
        collection: 'groups',
        where: { prefix: { equals: p } },
        limit: 1,
        depth: 0,
      })
      const group = groupResult.docs[0]
      if (!group) return []
      const postResult = await payload.find({
        collection: 'posts',
        // Drafts disabled (spec item 6): every doc is published, so no
        // _status filter (the field no longer exists). Re-add when drafts
        // are re-enabled.
        where: { group: { equals: group.id } },
        limit: 100,
        depth: 1,
      })
      return postResult.docs
    },
    ['posts-by-group-prefix', prefix],
    {
      revalidate: 300,
      tags: [
        CACHE_TAGS.collection.groups,
        CACHE_TAGS.collection.posts,
        CACHE_TAGS.group(prefix),
      ],
    },
  )(prefix)

type CaseStudiesGroup = string | { id: string } | null | undefined

const caseStudiesKey = (group: CaseStudiesGroup): string | null => {
  if (group === null || group === undefined) return null
  return typeof group === 'string' ? group : String(group.id)
}

/**
 * Case-studies feed for the block-home-portfolio block. A configured group
 * (relationship on the block) pins the feed to that group's posts. Without
 * one, the default projects feed is used — /works (the F-04 canonical
 * prefix) with a fallback to the legacy /projects prefix for environments
 * that predate the rename.
 */
export const getCaseStudiesPosts = (
  group?: CaseStudiesGroup,
): Promise<Post[]> => {
  const key = caseStudiesKey(group)
  return unstable_cache(
    async (groupKey: string | null) => {
      const payload = await getPayloadClient()
      const prefetchGroup = async (prefix: string) => {
        const groupResult = await payload.find({
          collection: 'groups',
          where: { prefix: { equals: prefix } },
          limit: 1,
          depth: 0,
        })
        return groupResult.docs[0] ?? null
      }
      const fetchPosts = async (groupId: string) =>
        (
          await payload.find({
            collection: 'posts',
            // Drafts disabled (spec item 6): every doc is published, so no
            // _status filter (the field no longer exists). Re-add when
            // drafts are re-enabled.
            where: { group: { equals: groupId } },
            limit: 100,
            depth: 1,
          })
        ).docs

      if (groupKey) return fetchPosts(groupKey)
      for (const prefix of ['/works', '/projects']) {
        const group = await prefetchGroup(prefix)
        if (!group) continue
        const posts = await fetchPosts(String(group.id))
        if (posts.length > 0) return posts
      }
      return []
    },
    ['case-studies-posts', key ?? 'default'],
    {
      revalidate: REVALIDATE_EXPIRE,
      tags: [CACHE_TAGS.collection.posts, CACHE_TAGS.collection.groups],
    },
  )(key)
}

/**
 * Case-studies feed for the block-home-portfolio `posts` relationship. Fetches
 * the selected posts by id and returns them in the editor's stored order
 * (payload `find` with `id in [...]` does not guarantee array order, so we
 * reorder by the source id list). Used when the block has a curated set;
 * empty selection falls back to getCaseStudiesPosts (default projects feed).
 */
export const getSelectedCaseStudyPosts = (ids: string[]): Promise<Post[]> => {
  if (ids.length === 0) return Promise.resolve([])
  return unstable_cache(
    async (postIds: string[]) => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'posts',
        where: { id: { in: postIds } },
        limit: Math.max(postIds.length, 1),
        depth: 1,
      })
      const byId = new Map(res.docs.map((d) => [String(d.id), d]))
      return postIds
        .map((id) => byId.get(id))
        .filter((p): p is Post => p !== undefined)
    },
    ['selected-case-studies', ids.join(',')],
    {
      revalidate: REVALIDATE_EXPIRE,
      tags: [CACHE_TAGS.collection.posts],
    },
  )(ids)
}
