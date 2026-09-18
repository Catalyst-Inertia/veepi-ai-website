import type { Metadata } from 'next'
import type { Page, Post } from '@/payload-types'

export const SITE_NAME = 'Catatia'

export function buildPageMetadata(seo?: Page['seo'] | Post['seo']): Metadata {
  const title = seo?.title ? `${seo.title} | ${SITE_NAME}` : SITE_NAME
  const description = seo?.description ?? undefined
  const keywords = seo?.keywords
    ? seo.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined
  const ogImage = seo?.og_image
  const ogImages =
    typeof ogImage === 'object' && ogImage !== null && ogImage.url
      ? [{ url: ogImage.url }]
      : undefined
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      ...(ogImages ? { images: ogImages } : {}),
    },
  }
}

/** Alias kept for compatibility. */
export const pageMetadataBuilder = buildPageMetadata
