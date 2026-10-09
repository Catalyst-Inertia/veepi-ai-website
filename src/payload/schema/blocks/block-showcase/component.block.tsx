'use client'

import { useEffect, useState } from 'react'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'
import BrandRunner from './_components/BrandRunner'
import DesktopShowcase from './_components/DesktopShowcase'
import MobileShowcase from './_components/MobileShowcase'

export type BlockShowcaseProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockShowcase({
  id,
  heading,
  rating,
  ratingSubtitle,
  video1,
  video2,
  video3,
  video4,
  video5,
}: BlockShowcaseProps) {
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mql.matches)
    setMounted(true)

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const getVideoUrl = (vid: unknown) =>
    typeof vid === 'object' && vid !== null && 'url' in vid
      ? (vid.url as string) || undefined
      : undefined

  const v1 = getVideoUrl(video1)
  const v2 = getVideoUrl(video2)
  const v3 = getVideoUrl(video3)
  const v4 = getVideoUrl(video4)
  const v5 = getVideoUrl(video5)

  if (!mounted) {
    return <div className="min-h-screen bg-[#101010]" />
  }

  return (
    <div
      id={id}
      className="relative w-full bg-[#101010] isolate overflow-hidden"
    >
      <div className="w-full h-[12rem] absolute bottom-0 left-0 right-0 z-10 bg-linear-to-b to-[#101010] from-transparent"></div>
      {/* Unpinned Brand runner at the top */}
      <div className="w-full pt-16 relative z-30">
        <BrandRunner />
      </div>

      {isDesktop ? (
        <DesktopShowcase
          blockType="block-showcase"
          id={id}
          video1={video1}
          video2={video2}
          video3={video3}
          video4={video4}
          video5={video5}
          {...{ heading, rating, ratingSubtitle, v1, v2, v3, v4, v5 }}
        />
      ) : (
        <MobileShowcase
          blockType="block-showcase"
          id={id}
          video1={video1}
          video2={video2}
          video3={video3}
          video4={video4}
          video5={video5}
          {...{ heading, rating, ratingSubtitle, v1, v2, v3, v4, v5 }}
        />
      )}
    </div>
  )
}
