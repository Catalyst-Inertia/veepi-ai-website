import { revalidateAll, revalidateSingle } from '@/cms/revalidate/core'
import type { RevalidateCollection } from '@/cms/revalidate/core'

const VALID_COLLECTIONS: RevalidateCollection[] = ['pages', 'posts', 'groups']

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return Response.json(
      { revalidated: false, error: 'Request body must be valid JSON' },
      { status: 400 },
    )
  }

  if (body.secret !== process.env.REVALIDATE_SECRET) {
    return Response.json(
      { revalidated: false, error: 'Invalid secret' },
      { status: 401 },
    )
  }

  if (body.type === 'all') {
    await revalidateAll()
    return Response.json({ revalidated: true })
  }

  if (body.type === 'single') {
    if (
      typeof body.collection !== 'string' ||
      !VALID_COLLECTIONS.includes(body.collection as RevalidateCollection)
    ) {
      return Response.json(
        {
          revalidated: false,
          error: 'collection must be pages, posts, or groups',
        },
        { status: 400 },
      )
    }
    if (typeof body.slug !== 'string' || body.slug.length === 0) {
      return Response.json(
        { revalidated: false, error: 'slug is required' },
        { status: 400 },
      )
    }
    await revalidateSingle({
      collection: body.collection as RevalidateCollection,
      slug: body.slug,
      prefix: typeof body.prefix === 'string' ? body.prefix : undefined,
    })
    return Response.json({ revalidated: true })
  }

  return Response.json(
    { revalidated: false, error: "type must be 'single' or 'all'" },
    { status: 400 },
  )
}
