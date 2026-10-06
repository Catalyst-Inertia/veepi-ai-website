'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'
import Image from 'next/image'
import BrandRunner from './_components/BrandRunner'

gsap.registerPlugin(ScrollTrigger)

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
  const sectionRef = useRef<HTMLElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const card4Ref = useRef<HTMLDivElement>(null)
  const card5Ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=800%',
          pin: true,
          scrub: 1,
        },
      })

      // Start all cards below viewport
      gsap.set(
        [
          card1Ref.current,
          card2Ref.current,
          card3Ref.current,
          card4Ref.current,
          card5Ref.current,
        ],
        { y: '120vh' },
      )

      // Staggered speeds: widened gaps to pull cards further apart
      tl.to(
        card1Ref.current,
        { y: '-170vh', duration: 3.4, ease: 'sine.in' },
        0,
      )
      tl.to(
        card2Ref.current,
        { y: '-200vh', duration: 2.7, ease: 'sine.in' },
        '<+.35',
      )
      tl.to(
        card3Ref.current,
        { y: '-250vh', duration: 3, ease: 'sine.in' },
        '<+0.15',
      )
      tl.to(
        card4Ref.current,
        { y: '-230vh', duration: 3.0, ease: 'sine.in' },
        '<+0.25',
      )
      tl.to(
        card5Ref.current,
        { y: '-210vh', duration: 2.8, ease: 'sine.in' },
        '<-0.05',
      )

      // Add shorter empty space at the end so the pin holds briefly with just the text visible
      tl.to({}, { duration: 0.25 })
    },
    { scope: sectionRef },
  )

  const getVideoUrl = (vid: unknown) =>
    typeof vid === 'object' && vid !== null && 'url' in vid
      ? (vid.url as string) || undefined
      : undefined

  const v1 = getVideoUrl(video1)
  const v2 = getVideoUrl(video2)
  const v3 = getVideoUrl(video3)
  const v4 = getVideoUrl(video4)
  const v5 = getVideoUrl(video5)

  return (
    <div id={id} className="relative w-full bg-[#101010]">
      {/* Unpinned Brand runner at the top */}
      <div className="w-full pt-16 relative z-30">
        <BrandRunner />
      </div>

      <section
        ref={sectionRef}
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      >
        {/* 1. Blurred Veepi logo background */}
        <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[800px] w-[800px] -translate-x-1/2">
          <Image
            src="/veepi-logo.svg"
            alt=""
            aria-hidden
            fill
            className="object-contain opacity-60 blur-[100px]"
          />
        </div>

        {/* 2. Glow orb (Figma: large single orb centred on heading) */}
        <div className="pointer-events-none absolute top-[50%] left-[50%] z-0 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(140,50,180,0.6)_0%,rgba(190,80,60,0.4)_45%,transparent_75%)] blur-[60px]" />

        {/* Content column - perfectly centered */}
        <div className="relative z-0 flex w-full flex-col items-center gap-8">
          {/* 3a. Star rating row */}
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 1L9.854 5.756L15 6.18L11.25 9.424L12.472 14.5L8 11.75L3.528 14.5L4.75 9.424L1 6.18L6.146 5.756L8 1Z"
                    fill="#F0876B"
                  />
                </svg>
              ))}
            </div>
            {rating && (
              <span className="font-text text-[12px] font-extrabold leading-[18px] text-[#FBF2E9]">
                {rating}
              </span>
            )}
            {ratingSubtitle && (
              <span className="font-text text-[12px] font-normal leading-[18px] text-[#FBF2E9]">
                {ratingSubtitle}
              </span>
            )}
          </div>

          {/* 3b. "All from one software." heading */}
          {heading && (
            <h2 className="font-title text-[120px] font-normal leading-[96px] text-center text-[#FBF2E9]">
              {heading}
            </h2>
          )}
        </div>

        {/* 4. Five format cards container - absolute centered */}
        <div className="absolute top-1/2 left-1/2 z-20 h-[900px] w-full -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {/* Card 1: LinkedIn 1:1 */}
          <div
            ref={card1Ref}
            className="absolute left-[calc(50%-656px)] top-[0px] h-[665px] w-[310px] overflow-hidden rounded-[16px] bg-black shadow-[0px_0px_40px_rgba(0,0,0,0.6)] pointer-events-auto"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src={v1}
            />
          </div>

          {/* Card 2: YouTube 16:9 */}
          <div
            ref={card2Ref}
            className="absolute left-[calc(50%-211px)] top-[139px] h-[303px] w-[422px] overflow-hidden rounded-[16px] bg-black shadow-[0px_0px_40px_rgba(0,0,0,0.6)] pointer-events-auto"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src={v2}
            />
          </div>

          {/* Card 3: IGS */}
          <div
            ref={card3Ref}
            className="absolute left-[calc(50%+346px)] top-[57px] h-[632px] w-[310px] overflow-hidden rounded-[16px] bg-black shadow-[0px_0px_40px_rgba(0,0,0,0.6)] pointer-events-auto"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src={v3}
            />
          </div>

          {/* Card 4: TikTok */}
          <div
            ref={card4Ref}
            className="absolute left-[calc(50%-433px)] top-[750px] h-[580px] w-[308px] overflow-hidden rounded-[16px] bg-black shadow-[0px_0px_40px_rgba(0,0,0,0.6)] pointer-events-auto"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src={v4}
            />
          </div>

          {/* Card 5: Instagram 4:5 */}
          <div
            ref={card5Ref}
            className="absolute left-[calc(50%+209px)] top-[750px] h-[579px] w-[310px] overflow-hidden rounded-[16px] bg-black shadow-[0px_0px_40px_rgba(0,0,0,0.6)] pointer-events-auto"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src={v5}
            />
          </div>
        </div>

        {/* 5. Bottom gradient fade */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-30 h-[200px] bg-gradient-to-b from-transparent to-[#101010]" />
      </section>
    </div>
  )
}
