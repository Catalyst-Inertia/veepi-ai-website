import Image from 'next/image'
import type { Media as MediaDoc } from '@/payload-types'

/**
 * Block visual renderer: renders a <video> when the media doc is a video
 * (mimeType video/), otherwise next/image. Always fills its parent container
 * (all consumers wrap it in a sized, relative box).
 *
 * Works in both server and client components — no server-only APIs.
 */
type MediaProps = {
  media: string | MediaDoc | null | undefined
  alt?: string
  sizes?: string
  objectFit?: 'cover' | 'contain'
  className?: string
  priority?: boolean
}

export default function Media({
  media,
  alt,
  sizes,
  objectFit = 'cover',
  className,
  priority,
}: MediaProps) {
  const doc = typeof media === 'object' && media !== null ? media : null
  const src = typeof media === 'string' ? media : (doc?.url ?? null)
  if (!src) return null

  const isVideo = doc?.mimeType?.startsWith('video/') ?? false
  const fit: 'cover' | 'contain' = objectFit === 'contain' ? 'contain' : 'cover'
  const altText = alt ?? doc?.alt ?? ''

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-label={altText || undefined}
        className={className}
        style={{ width: '100%', height: '100%', objectFit: fit }}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={altText}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: fit }}
    />
  )
}
