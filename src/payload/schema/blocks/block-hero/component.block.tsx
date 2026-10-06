'use client'

import { useRef } from 'react'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Media from '@/components/common/media'
import PayloadLink from '@/components/common/payload-link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export type BlockHeroProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockHero(props: BlockHeroProps) {
  const { id, title, heading, subText, logo, description, cta } = props
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || !containerRef.current) return
      const elements = gsap.utils.toArray<HTMLElement>(
        containerRef.current.children,
      )
      if (elements.length === 0) return

      // Every panel sits centered in its own viewport-height screen,
      // matching the Figma positions (50%-centered inside each 810px band).
      gsap.set(elements, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
      })

      // Panels after the first start hidden below the viewport.
      if (elements.length > 1) {
        gsap.set(elements.slice(1), { autoAlpha: 0, y: window.innerHeight })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${elements.length * 100}%`,
          pin: true,
          scrub: 1,
        },
      })

      for (let i = 0; i < elements.length - 1; i++) {
        tl.to(elements[i], {
          autoAlpha: 0,
          y: -window.innerHeight,
          duration: 1,
        })
        tl.to(elements[i + 1], { autoAlpha: 1, y: 0, duration: 1 }, '<')
        tl.to({}, { duration: 0.5 })
      }
    },
    { scope: sectionRef },
  )

  return (
    <section
      id={id}
      ref={sectionRef}
      data-is-hero="true"
      className="relative w-full h-screen overflow-hidden bg-[#1E1E1E]"
    >
      <video
        src="/videos/hero-bg.webm"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark overlay to make text readable */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div
        ref={containerRef}
        className="relative z-10 w-full h-full max-w-[1440px] mx-auto pointer-events-none"
      >
        {/* Screen 1: Hero Title — FreightDispCmp 120/96, Linen, centered */}
        <div className="w-full max-w-full text-center pointer-events-auto whitespace-nowrap max-lg:whitespace-normal px-[5%]">
          <h1 className="font-title font-normal text-[120px] leading-[96px] text-[#FBF2E9] max-md:text-[60px] max-md:leading-tight">
            {title}
          </h1>
        </div>

        {/* Screen 2: Hero Heading + Sub Text — centered, gap 40 */}
        <div className="w-full max-w-full text-center flex flex-col items-center gap-[40px] pointer-events-auto px-[5%]">
          <h2 className="font-title font-normal text-[120px] leading-[96px] text-[#FBF2E9] whitespace-nowrap max-lg:whitespace-normal max-md:text-[60px] max-md:leading-tight">
            {heading}
          </h2>
          <div className="font-title font-normal text-[48px] leading-[48px] text-[#FBF2E9] whitespace-nowrap max-lg:whitespace-normal max-md:text-[24px] max-md:leading-tight">
            {subText}
          </div>
        </div>

        {/* Screen 3: Logo + Description + CTA — 640px column, gap 48 */}
        <div className="w-full max-w-[640px] flex flex-col items-center gap-[48px] pointer-events-auto max-md:max-w-[90vw]">
          <div className="flex flex-col items-center gap-[24px]">
            {/* Logo — 121x48 */}
            <div className="relative w-[121px] h-[48px]">
              <Media media={logo} objectFit="contain" />
            </div>

            {/* Description — h3: FreightDispCmp 48/48, p: Sofia Pro 16/24, gap 24 */}
            <div className="text-center text-[#FBF2E9] flex flex-col items-center gap-[24px] max-w-none [&_h3]:font-title [&_h3]:font-normal [&_h3]:text-[48px] [&_h3]:leading-[48px] [&_h3]:m-0 [&_p]:font-text [&_p]:font-normal [&_p]:text-[16px] [&_p]:leading-[24px] [&_p]:m-0">
              {description && <RichText data={description} />}
            </div>
          </div>

          {/* CTA button — 285x48, gap 16, gradient, radius 8 */}
          {cta && cta.url && (
            <PayloadLink
              link={cta as Parameters<typeof PayloadLink>[0]['link']}
              className="flex flex-row justify-center items-center px-[24px] py-[12px] gap-[16px] w-[285px] h-[48px] rounded-[8px] transition-opacity hover:opacity-90 bg-[linear-gradient(90deg,#C05EC4_0%,#F0876B_100%)]"
            >
              <span className="font-text font-normal text-[12px] leading-[12px] uppercase text-[#FBF2E9] flex items-center text-center">
                {cta.label}
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.75 2.5L12 6.5L16 7.75L12 9L10.75 13L9.5 9L5.5 7.75L9.5 6.5L10.75 2.5Z"
                  fill="#FBF2E9"
                />
                <path
                  d="M18.5 13L19.25 15.25L21.5 16L19.25 16.75L18.5 19L17.75 16.75L15.5 16L17.75 15.25L18.5 13Z"
                  fill="#FBF2E9"
                />
              </svg>
            </PayloadLink>
          )}
        </div>
      </div>
    </section>
  )
}
