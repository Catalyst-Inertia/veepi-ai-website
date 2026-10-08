import type { Metadata } from 'next'
import type { Page, Post } from '@/payload-types'

export const SITE_NAME = 'VeePi'

export function buildPageMetadata(seo?: Page['seo'] | Post['seo']): Metadata {
  const rawTitle =
    seo?.title || 'VeePi - AI Video Platform for Medical & Aesthetic Practices'
  const title = rawTitle.includes('VeePi') ? rawTitle : `${rawTitle} | VeePi`

  const description =
    seo?.description ||
    'Transform your patient results and treatment imagery into high-performing video content for Reels, TikTok, YouTube, and Stories. Built for aesthetic & medical professionals.'

  const keywords = seo?.keywords
    ? seo.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined

  const ogImage = seo?.og_image
  const ogImageUrl =
    typeof ogImage === 'object' && ogImage !== null && ogImage.url
      ? ogImage.url
      : '/og-image.png'

  let metaBaseUrl: URL | undefined
  try {
    metaBaseUrl = new URL(
      process.env.NEXT_PUBLIC_SERVER_URL || 'https://veepi.ai',
    )
  } catch {
    try {
      metaBaseUrl = new URL('https://veepi.ai')
    } catch {
      // absolute fallback
    }
  }

  return {
    metadataBase: metaBaseUrl,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

/** Alias kept for compatibility. */
export const pageMetadataBuilder = buildPageMetadata
