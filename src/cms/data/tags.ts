// Shared cache-tag scheme + public-path helpers.
// Plain module (no `server-only`) so it can be imported from Payload
// configs/hooks (admin bundle) AND Next cache/revalidate code.

export const CACHE_TAGS = {
  collection: {
    pages: 'collection:pages',
    posts: 'collection:posts',
    groups: 'collection:groups',
  },
  page: (slug: string) => `page:${slug}`,
  post: (slug: string) => `post:${slug}`,
  group: (prefix: string) => `group:${prefix}`,
  global: {
    header: 'global:header',
    footer: 'global:footer',
    config: 'global:config',
  },
} as const

/**
 * Single source of truth for the CMS cache lifetime (spec item 4). Used by
 * every unstable_cache TTL, the catch-all route's `revalidate` export, and
 * the revalidation hooks' tag expiry. Change cache timing in one place only.
 */
export const REVALIDATE_EXPIRE = 300

export const normalizePrefix = (prefix: string): string => {
  const trimmed = prefix.trim()
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export type PagePathInput = {
  slug: string
  /** Homepage decision comes from the flag, not the slug. */
  isHomepage?: boolean | null
}

/**
 * Public URL of a page: `/` for the flagged homepage, `/<slug>` otherwise.
 * The homepage is decided by the `isHomepage` flag (pages.collection), never
 * by the slug value.
 */
export const pagePublicPath = (page: PagePathInput): string =>
  page.isHomepage ? '/' : `/${page.slug}`

export const postPublicPath = (prefix: string, slug: string): string =>
  `${normalizePrefix(prefix).replace(/\/+$/, '')}/${slug}`
