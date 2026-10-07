'use client'

import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'
import Media from '@/components/common/media'

export type BlockDistributionProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockDistribution({
  id,
  heading,
  tagLabel,
  description,
  backgroundMedia,
}: BlockDistributionProps) {
  return (
    <section
      id={id}
      className="w-full bg-[#101010] pt-20 lg:pt-[20rem] pb-20 lg:pb-[12rem]"
    >
      <div className="relative w-full h-[80vh] overflow-hidden">
        {/* Full-bleed background — Media always fills its sized relative parent */}
        <div className="absolute inset-0 w-full h-full">
          <Media media={backgroundMedia} objectFit="cover" />
        </div>

        {/* Radial vignette: transparent center, #101010 at edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(16, 16, 16, 0) 0%, #101010 100%)',
          }}
        />

        {/* Bottom content row — 1312px wide, items-end, gap-24px, 80px from bottom */}
        <div className="absolute bottom-8 lg:bottom-[80px] left-1/2 -translate-x-1/2 w-full lg:w-[1312px] max-w-[calc(100%-32px)] lg:max-w-[calc(100%-128px)] flex flex-col lg:flex-row items-start lg:items-end gap-6">
          {/* Left: large serif heading — FreightDispCmp 72px/72px, Linen */}
          <h2 className="w-full lg:flex-1 font-title font-normal text-[48px] lg:text-[72px] leading-[48px] lg:leading-[72px] text-[#FBF2E9]">
            {heading}
          </h2>

          {/* Right: pill tag + description, flex-col items-end gap-16px, 527px wide */}
          <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-[527px]">
            {/* Dotted Highlight Tag pill — 244px × 40px, padding 8px 32px 8px 8px */}
            <div
              className="relative flex flex-row items-center gap-6 h-10 rounded-[40px]"
              style={{
                padding: '8px 32px 8px 8px',
                background:
                  'linear-gradient(0.56deg, rgba(192, 94, 196, 0.1) 0%, rgba(240, 135, 107, 0.1) 100%)',
              }}
            >
              {/* Outer border ring — rgba(255,255,255,0.05) */}
              <span
                className="absolute inset-0 rounded-[40px] pointer-events-none"
                style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
              />

              {/* Purple gradient top-line on pill */}
              <span
                className="absolute top-0 h-px pointer-events-none"
                style={{
                  left: '19.3%',
                  right: '18.7%',
                  background:
                    'linear-gradient(90deg, rgba(192, 94, 196, 0) 0%, #C05EC4 50%, rgba(192, 94, 196, 0) 100%)',
                }}
              />

              {/* Gradient icon circle — 24×24, gradient 225deg */}
              <span
                className="relative flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full z-10"
                style={{
                  background:
                    'linear-gradient(225deg, #F0876B 0%, #C05EC4 100%)',
                }}
              >
                {/* Inner border on icon */}
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1.2px solid rgba(255, 255, 255, 0.15)' }}
                />
                {/* Messages / chat icon — 14.4×14.4, white */}
                <svg
                  width="14.4"
                  height="14.4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10"
                >
                  <path
                    d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                    fill="white"
                  />
                </svg>
              </span>

              {/* Tag label — Sofia Pro 800, 10px, tracking-[8px], uppercase, Linen */}
              <span className="relative z-10 font-text font-extrabold text-[10px] leading-[10px] tracking-[8px] uppercase text-[#FBF2E9]">
                {tagLabel}
              </span>
            </div>

            {/* Description — Sofia Pro 400, 16px/24px, right-aligned, Linen */}
            <p className="font-text font-normal text-[16px] leading-[24px] text-left lg:text-right text-[#FBF2E9] m-0">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
