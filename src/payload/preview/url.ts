import type { Payload } from 'payload'

type GeneratePreviewPathArgs = {
  /** Collection slug; other collections get no preview URL. */
  collection?: string
  /** The document being edited (draft form state, may be unsaved). */
  data?: Record<string, unknown>
  /** For resolving a post's group relationship when it is only an ID. */
  payload?: Payload
}

// Same public-path rules as the frontend catch-all:
// - pages: '/' for the homepage, '/<slug>' otherwise
// - posts: '/<group prefix>/<slug>'
// Returns null when no meaningful public URL exists (hides the preview button).
export const buildPreviewUrl = (path: string): string => {
  const params = new URLSearchParams({
    path,
    secret: process.env.REVALIDATE_SECRET || '',
  })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return `${baseUrl}/preview?${params.toString()}`
}

export const generatePreviewPath = async ({
  collection,
  data,
  payload,
}: GeneratePreviewPathArgs): Promise<string | null> => {
  if (collection !== 'pages' && collection !== 'posts') return null

  const slug = data?.slug
  if (typeof slug !== 'string' || slug.length === 0) return null

  let path: string
  if (collection === 'pages') {
    // Homepage = the isHomepage flag (sidebar checkbox), never the slug.
    path = data?.isHomepage === true ? '/' : `/${slug}`
  } else {
    const group = data?.group
    let prefix: string | null = null
    if (typeof group === 'string') {
      const resolved = await payload?.findByID({
        collection: 'groups',
        id: group,
        depth: 0,
      })
      prefix = typeof resolved?.prefix === 'string' ? resolved.prefix : null
    } else if (
      group !== null &&
      typeof group === 'object' &&
      typeof (group as { prefix?: unknown }).prefix === 'string'
    ) {
      prefix = (group as { prefix: string }).prefix
    }
    if (!prefix) return null
    path = `${prefix.replace(/\/+$/, '')}/${slug}`
  }

  return buildPreviewUrl(path)
}
