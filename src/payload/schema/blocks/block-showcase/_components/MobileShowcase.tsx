'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import type { BlockShowcaseProps } from '../component.block'

gsap.registerPlugin(ScrollTrigger)

export default function MobileShowcase({
  heading,
  rating,
  ratingSubtitle,
  v1,
  v2,
  v3,
  v4,
  v5,
}: BlockShowcaseProps & {
  v1?: string
  v2?: string
  v3?: string
  v4?: string
  v5?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          pinSpacing: false,
          scrub: 0.5,
        },
      })

      // Start card 1 just below viewport
      gsap.set(wrapperRef.current, { y: 0 })

      // Animate until the bottom of the last card is at least 100px above viewport
      tl.to(wrapperRef.current, {
        y: () =>
          -(wrapperRef.current?.scrollHeight || 2000) -
          window.innerHeight -
          100,
        duration: 0.9,
        ease: 'none',
      })

      // Hold empty pin for the remaining 10% of scroll before unpinning
      tl.to({}, { duration: 0.1 })
    },
    { scope: sectionRef },
  )

  return (
    <div className="relative w-full z-0 h-[500vh]">
      <section
        ref={sectionRef}
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-20"
      >
        {/* 1. Blurred Veepi logo background */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[800px] w-[800px] -translate-y-1/2 -translate-x-1/2">
          <Image
            src="/assets/images/veepi-logo-only.webp"
            alt=""
            aria-hidden
            fill
            className="object-contain opacity-60 blur-[60px]"
          />
        </div>

        {/* Content column - centered text */}
        <div className="relative z-0 flex w-full flex-col items-center gap-8 px-4">
          <div className="flex flex-col items-center gap-2">
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
              <span className="font-text text-[12px] font-normal leading-[18px] text-[#FBF2E9] text-center">
                {ratingSubtitle}
              </span>
            )}
          </div>

          {heading && (
            <h2 className="font-title text-[64px] font-normal leading-tight text-center text-[#FBF2E9]">
              {heading}
            </h2>
          )}
        </div>

        {/* Vertical list of cards */}
        <div
          ref={wrapperRef}
          className="absolute left-1/2 top-[100vh] z-20 flex w-full -translate-x-1/2 flex-col items-center gap-6 pointer-events-none"
        >
          {[
            {
              src: v1,
              frame: '/assets/images/frames/linkedin.svg',
              width: 310,
              height: 665,
              cardClass: 'aspect-[310/665] max-w-[310px] bg-black',
              videoClass: 'inset-x-0 top-[26%] h-[46.65%] w-full',
            },
            {
              src: v2,
              frame: '/assets/images/frames/youtube.svg',
              width: 422,
              height: 303,
              cardClass: 'aspect-[422/303] max-w-[360px] bg-[#111111]',
              videoClass:
                'left-[1.33%] top-[2.07%] h-[74.54%] w-[97.33%] rounded-[6.5px]',
            },
            {
              src: v3,
              frame: '/assets/images/frames/igs.svg',
              width: 310,
              height: 632,
              cardClass: 'aspect-[310/632] max-w-[310px] bg-black',
              videoClass: 'inset-x-0 top-0 h-[87.08%] w-full',
            },
            {
              src: v4,
              frame: '/assets/images/frames/tiktok.svg',
              width: 308,
              height: 580,
              cardClass: 'aspect-[308/580] max-w-[308px] bg-black',
              videoClass: 'inset-x-0 top-0 h-[94.41%] w-full',
            },
            {
              src: v5,
              frame: '/assets/images/frames/instagram.svg',
              width: 310,
              height: 579,
              cardClass: 'aspect-[310/579] max-w-[310px] bg-white',
              videoClass: 'inset-x-0 top-[9.33%] h-[66.76%] w-full',
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`relative w-[90%] overflow-hidden rounded-[16px] shadow-[0px_0px_40px_rgba(0,0,0,0.6)] pointer-events-auto flex-shrink-0 ${card.cardClass}`}
            >
              {card.src && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`absolute object-cover ${card.videoClass}`}
                  src={card.src}
                />
              )}
              <img
                src={card.frame}
                alt=""
                aria-hidden
                width={card.width}
                height={card.height}
                className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
