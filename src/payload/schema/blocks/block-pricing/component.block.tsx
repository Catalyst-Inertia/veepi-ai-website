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

export type BlockPricingProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockPricing(props: BlockPricingProps) {
  const { id, title, tagLabel, tagline, description, logos, plans } = props
  const sectionRef = useRef<HTMLElement>(null)
  const columnRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        const col = columnRef.current
        if (!col) return
        // Scroll dynamically based on layout, stopping when last card passes yellow line (~45% viewport)
        const dist = Math.max(0, col.clientHeight - window.innerHeight * 0.45)
        if (dist === 0) return
        gsap.to(col, {
          y: -dist,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${dist}`,
            pin: true,
            scrub: true,
          },
        })
      })
    },
    { scope: sectionRef },
  )
  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full overflow-visible bg-[#FBF2E9] lg:h-screen lg:overflow-hidden"
    >
      <BoxContainer sectionClassName="lg:h-full" containerClassName="lg:h-full">
        <div className="relative flex flex-col gap-16 pb-12 pt-16 md:pt-24 lg:h-full lg:flex-row lg:justify-between lg:pb-12 lg:pt-[136px]">
          {/* Left Column */}
          <div className="relative z-10 flex shrink-0 flex-col gap-8 lg:w-[421px]">
            {/* Tag Pill */}
            {tagLabel && (
              <div className="relative inline-flex h-10 w-fit items-center gap-6 self-start rounded-full bg-[linear-gradient(180deg,rgba(192,94,196,0.1)_0%,rgba(240,135,107,0.1)_100%)] py-2 pl-2 pr-8 ring-1 ring-white/5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="24"
                    height="24"
                    rx="12"
                    fill="url(#paint0_linear_1_1067)"
                  />
                  <mask id="path-2-inside-1_1_1067" fill="white">
                    <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" />
                  </mask>
                  <path
                    d="M0 12M24 12M24 12M0 12M12 0M24 12M12 24M0 12M12 24V22.8C6.03533 22.8 1.2 17.9647 1.2 12H0H-1.2C-1.2 19.2902 4.70984 25.2 12 25.2V24ZM24 12H22.8C22.8 17.9647 17.9647 22.8 12 22.8V24V25.2C19.2902 25.2 25.2 19.2902 25.2 12H24ZM12 0V1.2C17.9647 1.2 22.8 6.03533 22.8 12H24H25.2C25.2 4.70984 19.2902 -1.2 12 -1.2V0ZM12 0V-1.2C4.70984 -1.2 -1.2 4.70984 -1.2 12H0H1.2C1.2 6.03533 6.03533 1.2 12 1.2V0Z"
                    fill="white"
                    fillOpacity="0.15"
                    mask="url(#path-2-inside-1_1_1067)"
                  />
                  <g clipPath="url(#clip0_1_1067)">
                    <path
                      d="M8.40006 6.6001H17.4001C18.0628 6.6001 18.6001 7.13736 18.6001 7.8001V15.0001M8.40006 10.8001H10.2001M8.40006 12.6001H10.2001M8.40006 14.4001H10.2001M7.92006 16.8001H14.8801C15.5521 16.8001 15.8882 16.8001 16.1449 16.6693C16.3706 16.5543 16.5542 16.3707 16.6693 16.1449C16.8001 15.8882 16.8001 15.5522 16.8001 14.8801V10.3201C16.8001 9.64803 16.8001 9.312 16.6693 9.05531C16.5542 8.82951 16.3706 8.64594 16.1449 8.53089C15.8882 8.4001 15.5521 8.4001 14.8801 8.4001H7.92006C7.248 8.4001 6.91197 8.4001 6.65527 8.53089C6.42948 8.64594 6.2459 8.82951 6.13085 9.05531C6.00006 9.312 6.00006 9.64803 6.00006 10.3201V14.8801C6.00006 15.5522 6.00006 15.8882 6.13085 16.1449C6.2459 16.3707 6.42948 16.5543 6.65527 16.6693C6.91197 16.8001 7.248 16.8001 7.92006 16.8001ZM12.4801 13.2001H13.9201C14.0881 13.2001 14.1721 13.2001 14.2363 13.1674C14.2927 13.1386 14.3386 13.0927 14.3674 13.0363C14.4001 12.9721 14.4001 12.8881 14.4001 12.7201V11.2801C14.4001 11.1121 14.4001 11.0281 14.3674 10.9639C14.3386 10.9075 14.2927 10.8616 14.2363 10.8328C14.1721 10.8001 14.0881 10.8001 13.9201 10.8001H12.4801C12.312 10.8001 12.228 10.8001 12.1639 10.8328C12.1074 10.8616 12.0615 10.9075 12.0328 10.9639C12.0001 11.0281 12.0001 11.1121 12.0001 11.2801V12.7201C12.0001 12.8881 12.0001 12.9721 12.0328 13.0363C12.0615 13.0927 12.1074 13.1386 12.1639 13.1674C12.228 13.2001 12.312 13.2001 12.4801 13.2001Z"
                      stroke="#FBF2E9"
                      strokeLinecap="round"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_1_1067"
                      x1="24"
                      y1="0"
                      x2="0"
                      y2="24"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#F0876B" />
                      <stop offset="1" stopColor="#C05EC4" />
                    </linearGradient>
                    <clipPath id="clip0_1_1067">
                      <rect
                        width="14.4"
                        height="14.4"
                        fill="white"
                        transform="translate(4.80005 4.80029)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span className="font-text text-[10px] font-extrabold uppercase leading-[10px] tracking-[8px] text-[#372B34]">
                  {tagLabel}
                </span>
                <div className="absolute left-[48px] top-0 h-px w-[153px] bg-[linear-gradient(90deg,rgba(192,94,196,0)_0%,#C05EC4_50%,rgba(192,94,196,0)_100%)]" />
              </div>
            )}

            {/* Heading */}
            <h2 className="font-title text-[48px] leading-[1] text-[#372B34] md:text-[72px]">
              {title}
            </h2>

            {/* Tagline */}
            {tagline && (
              <div className="max-w-[533px] font-text text-[16px] leading-6 text-[#6E6155] [&_p]:font-extrabold">
                <RichText data={tagline} />
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="max-w-[421px] font-text text-[16px] leading-6 text-[#6E6155]">
                <RichText data={description} />
              </div>
            )}

            {/* Logos */}
            {logos && logos.length > 0 && (
              <div className="mt-auto flex items-center gap-4">
                {logos.map((logoItem, idx) => (
                  <div key={idx} className="relative h-6 w-[120px]">
                    <Media
                      media={logoItem.logo}
                      className="size-full brightness-0 opacity-60 mix-blend-multiply"
                      objectFit="contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div
            ref={columnRef}
            className="relative flex shrink-0 flex-col gap-4 lg:h-max lg:self-start lg:w-[644px] lg:pb-6 lg:pt-[137px]"
          >
            {plans?.map((plan, idx) => {
              const hasBlob = plan.planName === 'Professional'
              return (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-3xl bg- bg-white/30 p-8 border-white border backdrop-blur-[2px]"
                >
                  {hasBlob && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-[calc(50%-353px/2-270px)] top-0 h-[349px] w-[353px] rotate-[38.71deg] bg-[linear-gradient(180deg,rgba(240,135,107,0.8)_0%,rgba(192,94,196,0.8)_100%)] blur-[100px]"
                    />
                  )}
                  <div className="relative flex flex-col gap-6">
                    <h3 className="font-title text-[36px] leading-[1] text-[#372B34] md:text-[48px]">
                      {plan.planName}
                    </h3>
                    <div className="flex flex-col gap-6 md:flex-row">
                      {/* Sub-col Left */}
                      <div className="flex flex-1 flex-col gap-6">
                        {plan.tagline && (
                          <div className="font-text text-[16px] leading-6 text-[#372B34] [&_p]:font-extrabold">
                            <RichText data={plan.tagline} />
                          </div>
                        )}
                        {plan.description && (
                          <div className="font-text text-[16px] leading-6 text-[#6E6155]">
                            <RichText data={plan.description} />
                          </div>
                        )}
                        {plan.cta?.url && (
                          <PayloadLink
                            link={{
                              label: plan.cta.label || '',
                              type: plan.cta.type || 'custom',
                              url: plan.cta.url,
                              newTab: plan.cta.newTab ?? false,
                            }}
                            className="flex h-12 w-full items-center justify-center rounded-lg bg-[linear-gradient(90deg,#C05EC4_0%,#F0876B_100%)] px-6 font-text text-[12px] uppercase leading-none text-[#FBF2E9]"
                          />
                        )}
                      </div>
                      {/* Includes */}
                      <div className="md:w-[278px]">
                        <p className="font-text text-[16px] leading-6 text-[#6E6155]">
                          {plan.includesLabel ?? 'Includes'}
                        </p>
                        {plan.includes && plan.includes.length > 0 && (
                          <ul className="list-disc space-y-0 pl-4 font-text text-[16px] leading-6 text-[#6E6155] marker:text-[#6E6155]">
                            {plan.includes.map((inc, i) => (
                              <li key={i}>{inc.item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </BoxContainer>
    </section>
  )
}
