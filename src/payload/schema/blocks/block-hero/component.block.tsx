'use client'

import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'
import { RichText } from '@payloadcms/richtext-lexical/react'
import PayloadLink from '@/components/common/payload-link'
import Media from '@/components/common/media'
import BoxContainer from '@/components/container/boxed'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export type BlockHeroProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockHero(props: BlockHeroProps) {
  const { id, backgroundMedia, animatedTexts, description, logos, cta } = props
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || !containerRef.current) return
      const elements = gsap.utils.toArray<HTMLElement>(
        containerRef.current.children,
      )
      if (elements.length === 0) return

      // Position all text elements absolutely in the center
      gsap.set(containerRef.current, { position: 'relative' })
      gsap.set(elements, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        width: '100%',
      })

      // Start all elements EXCEPT the first one hidden at bottom of screen
      if (elements.length > 1) {
        gsap.set(elements.slice(1), { autoAlpha: 0, y: window.innerHeight })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${elements.length * 100}%`,
          pin: true,
          scrub: true,
        },
      })

      for (let i = 0; i < elements.length - 1; i++) {
        const current = elements[i]
        const next = elements[i + 1]

        tl.to(
          current,
          { y: -window.innerHeight, autoAlpha: 0, duration: 1 },
          i > 0 ? '+=0.5' : undefined,
        ).to(next, { y: 0, autoAlpha: 1, duration: 1 }, '<0.5')
      }
    },
    { scope: sectionRef },
  )

  return (
    <section
      id={id}
      ref={sectionRef}
      className="bg-black-color relative w-full h-screen overflow-hidden flex flex-col"
    >
      {/* Background media + gradient scrim */}
      <div className="absolute inset-0 z-0">
        {backgroundMedia && (
          <Media media={backgroundMedia} objectFit="cover" priority />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(23,21,21,0.55)_0%,rgba(23,21,21,0.15)_25%,rgba(23,21,21,0.10)_55%,rgba(23,21,21,0.80)_100%)]" />
      </div>

      {/* Title — dead center */}
      <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4 pointer-events-none">
        <div ref={containerRef} className="w-full max-w-[1000px] h-[200px]">
          {animatedTexts?.map((item, index) => {
            if (item.textStyle === 'heading') {
              return (
                <div
                  key={item.id || index}
                  className="font-title leading-[1.05] text-[#FBF2E9] w-full mx-auto max-w-[1000px] [&_p]:text-[36px] md:[&_p]:text-[80px] lg:[&_p]:text-[120px] text-center [&_p]:text-center [&_p]:m-0 pointer-events-auto"
                >
                  <RichText data={item.text!} />
                </div>
              )
            }
            return (
              <div
                key={item.id || index}
                className="w-full mx-auto max-w-[800px] text-center font-text text-[16px] md:text-[18px] leading-relaxed text-[#FBF2E9] px-4 flex flex-col gap-6 pointer-events-auto [&_p]:m-0 [&_p]:text-center"
              >
                <RichText data={item.text!} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom bar: tagline + logos left, CTA right */}
      <div className="relative isolate z-10 pt-32 pb-10 md:pb-12 w-full mt-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent -z-10 pointer-events-none" />
        <BoxContainer>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-4 text-[#FBF2E9]">
              {description && (
                <div className="leading-snug max-w-[600px] [&_p]:text-[13px]">
                  <RichText data={description} />
                </div>
              )}
              {logos && logos.length > 0 && (
                <div className="flex items-center gap-6">
                  {logos.map((item, i) =>
                    item.logo ? (
                      <div key={i} className="relative h-[20px] w-[326px]">
                        <Media media={item.logo} objectFit="contain" />
                      </div>
                    ) : null,
                  )}
                </div>
              )}
            </div>

            {cta?.url && (
              <PayloadLink
                link={{
                  label: '',
                  type: cta.type,
                  url: cta.url,
                  newTab: cta.newTab ?? false,
                }}
                className="flex items-center gap-2 px-4 py-[10px] rounded-[8px] backdrop-blur-md bg-white/10 border border-white/25 hover:bg-white/20 transition-all duration-300 self-start md:self-auto shrink-0 whitespace-nowrap"
              >
                <span className="font-text text-[10px] leading-none uppercase tracking-[0.04em] text-[#FBF2E9]">
                  {cta.label}
                </span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 20 20"
                  fill="#FBF2E9"
                  aria-hidden="true"
                >
                  <path d="M10 1 L11.9 8.1 L19 10 L11.9 11.9 L10 19 L8.1 11.9 L1 10 L8.1 8.1 Z" />
                  <path d="M17 13 l0.8 2.2 2.2 0.8 -2.2 0.8 -0.8 2.2 -0.8 -2.2 -2.2 -0.8 2.2 -0.8 Z" />
                </svg>
              </PayloadLink>
            )}
          </div>
        </BoxContainer>
      </div>
    </section>
  )
}
