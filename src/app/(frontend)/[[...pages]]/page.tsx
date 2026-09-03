import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import PageBuilder from '@/components/common/page-builder'
import {
  getAllPublishedPages,
  getAllPublishedPostPaths,
  getHomepageData,
  getPageData,
  getPostPageData,
} from '@/cms/data/action'
import { REVALIDATE_EXPIRE } from '@/cms/data/tags'
import { buildPageMetadata } from '@/utils/metadata-page-builder'
import type { Page, Post } from '@/payload-types'

// Next requires a literal for route segment config (statically analyzed;
// imported values are rejected). Keep this in sync with the shared constant
// — the guard fails the build if they drift.
if (REVALIDATE_EXPIRE !== 300) {
  throw new Error(
    `page revalidate (300) must match REVALIDATE_EXPIRE (${REVALIDATE_EXPIRE})`,
  )
}
export const revalidate = 300

type PageParams = { pages?: string[] }
type PageProps = { params: Promise<PageParams> }

type Resolved = { page?: Page; post?: Post } | null

async function resolvePage(
  params: PageParams,
  draft: boolean,
): Promise<Resolved> {
  const segments = params.pages ?? []
  if (segments.length === 0) {
    const page = await getHomepageData({ draft })
    return page ? { page } : null
  }
  if (segments.length === 1) {
    const page = await getPageData({ slug: segments[0], draft })
    return page ? { page } : null
  }
  if (segments.length === 2) {
    const post = await getPostPageData({
      prefix: segments[0],
      slug: segments[1],
      draft,
    })
    return post ? { post } : null
  }
  return null
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { pages } = await params
  const draft = (await draftMode()).isEnabled
  const resolved = await resolvePage({ pages }, draft)
  if (!resolved) notFound()
  return buildPageMetadata(resolved.page?.seo ?? resolved.post?.seo)
}

export default async function Page({ params }: PageProps) {
  const { pages } = await params
  const draft = (await draftMode()).isEnabled
  const resolved = await resolvePage({ pages }, draft)
  if (!resolved) notFound()
  const doc = resolved.page ?? resolved.post
  if (!doc?.contents) notFound()
  return <PageBuilder blocks={doc.contents} />
}

export async function generateStaticParams() {
  const [pages, postPaths] = await Promise.all([
    getAllPublishedPages(),
    getAllPublishedPostPaths(),
  ])
  return [
    // The flagged homepage lives at / (no segments); every other page
    // renders at /<slug>.
    ...pages.map((p) => ({ pages: p.isHomepage ? [] : [p.slug] })),
    ...postPaths.map(({ prefix, slug }) => ({ pages: [prefix, slug] })),
  ]
}
