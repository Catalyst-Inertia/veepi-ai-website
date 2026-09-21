'use client'

import { useEffect, useRef, useCallback } from 'react'
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
  autoPlay?: boolean
  muted?: boolean
  videoRef?: React.Ref<HTMLVideoElement>
  controls?: boolean
}

export default function Media({
  media,
  alt,
  sizes,
  objectFit = 'cover',
  className,
  priority,
  autoPlay = true,
  muted = true,
  controls = false,
  videoRef,
}: MediaProps) {
  const internalRef = useRef<HTMLVideoElement | null>(null)
  const doc = typeof media === 'object' && media !== null ? media : null
  const src = typeof media === 'string' ? media : (doc?.url ?? null)

  useEffect(() => {
    if (autoPlay && internalRef.current) {
      const video = internalRef.current
      video.defaultMuted = muted
      video.muted = muted
      video.play().catch(() => {})
    }
  }, [autoPlay, src, muted])

  const handleRef = useCallback(
    (el: HTMLVideoElement | null) => {
      internalRef.current = el
      if (typeof videoRef === 'function') {
        videoRef(el)
      } else if (videoRef) {
        ;(videoRef as React.MutableRefObject<HTMLVideoElement | null>).current =
          el
      }
    },
    [videoRef],
  )
  if (!src) return null

  const isVideo = doc?.mimeType?.startsWith('video/') ?? false
  const fit: 'cover' | 'contain' = objectFit === 'contain' ? 'contain' : 'cover'
  const altText = alt ?? doc?.alt ?? ''

  if (isVideo) {
    const videoSrc = autoPlay || src.includes('#') ? src : `${src}#t=0.001`
    return (
      <video
        ref={handleRef}
        src={videoSrc}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop
        playsInline
        preload={autoPlay ? 'auto' : 'metadata'}
        aria-label={altText || undefined}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
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
