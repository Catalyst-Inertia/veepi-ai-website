'use client'

import React, { useRef, useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'
import Media from '@/components/common/media'
import PayloadLink from '@/components/common/payload-link'

export type BlockGalleryProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

const COLUMN_PATTERN: string[][] = [
  ['aspect-[310/174]', 'aspect-[310/348]'],
  ['aspect-[310/348]', 'aspect-[310/174]'],
  ['aspect-[310/261]', 'aspect-[310/261]'],
  ['aspect-[310/166]', 'aspect-[310/166]', 'aspect-[310/166]'],
]
const TILE_REPEAT = 3

export default function ContentsBlockGallery({
  id,
  title,
  description,
  cards,
}: BlockGalleryProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!stripRef.current) return
    isDown.current = true
    setIsDragging(false)
    startX.current = e.pageX - stripRef.current.offsetLeft
    scrollLeft.current = stripRef.current.scrollLeft
  }

  const handleMouseLeave = () => {
    isDown.current = false
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    isDown.current = false
    setTimeout(() => setIsDragging(false), 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !stripRef.current) return
    e.preventDefault()
    const x = e.pageX - stripRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    if (Math.abs(walk) > 5) {
      setIsDragging(true)
    }
    stripRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <section
      id={id}
      className="relative w-full min-h-[810px] overflow-hidden bg-[#372B34]"
    >
      {/* Blob */}
      <div
        aria-hidden
        className="absolute pointer-events-none left-[195px] top-[230px] h-[1049px] w-[1049px] rounded-full bg-[linear-gradient(180deg,#F0876B_0%,#C05EC4_100%)] blur-[200px] mix-blend-overlay rotate-[0.68deg] z-0"
      />

      {/* Header Row */}
      <div className="relative z-10 mx-auto mt-[120px] flex max-w-[1312px] items-start gap-6 px-6 min-[1440px]:px-0">
        <h2 className="font-title text-[40px] md:text-[64px] min-[1440px]:text-[72px] leading-none text-[#FBF2E9] flex-1">
          {title}
        </h2>

        <div className="flex w-full shrink-0 flex-col items-end gap-4 min-[1440px]:w-[527px]">
          {/* Dotted tag */}
          <div className="relative flex items-center gap-6 rounded-[40px] border border-white/5 py-2 pl-2 pr-8 bg-[linear-gradient(0.56deg,rgba(192,94,196,0.1)_0%,rgba(240,135,107,0.1)_100%)]">
            {/* Icon */}
            <span className="flex h-6 w-6 items-center justify-center rounded-[18px] border-[1.2px] border-white/15 bg-[linear-gradient(225deg,#F0876B_0%,#C05EC4_100%)] p-[4.8px]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.2 4.2H4.8C4.13726 4.2 3.6 4.73726 3.6 5.4V9.6C3.6 10.2627 4.13726 10.8 4.8 10.8H10.2C10.8627 10.8 11.4 10.2627 11.4 9.6V5.4C11.4 4.73726 10.8627 4.2 10.2 4.2Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6.3L8.4 7.5L6 8.7V6.3Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {/* Label */}
            <span className="font-text text-[10px] leading-none font-extrabold uppercase tracking-[8px] text-[#FBF2E9]">
              VIDEO GALLERY
            </span>
            {/* Purple line */}
            <span
              aria-hidden
              className="absolute top-0 left-[19.3%] right-[18.7%] h-px bg-[linear-gradient(90deg,rgba(192,94,196,0)_0%,#C05EC4_50%,rgba(192,94,196,0)_100%)]"
            />
          </div>

          {/* Description */}
          {description && (
            <div className="w-full text-right font-text text-[16px] leading-6 text-[#FBF2E9] [&_p]:m-0">
              <RichText data={description} />
            </div>
          )}
        </div>
      </div>

      {/* Strip */}
      {cards?.length ? (
        <div
          ref={stripRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onClickCapture={handleClickCapture}
          className={`relative z-10 mt-10 flex w-full gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {Array.from({ length: TILE_REPEAT * COLUMN_PATTERN.length }).map(
            (_, colIndex) => {
              const columnCards =
                COLUMN_PATTERN[colIndex % COLUMN_PATTERN.length]

              return (
                <div
                  key={colIndex}
                  className="flex w-[310px] shrink-0 flex-col gap-6"
                >
                  {columnCards.map((aspectClass, i) => {
                    // Calculate linear slot index to pick the card cyclically
                    // Number of cards in previous columns
                    let slotIndex = 0
                    for (let c = 0; c < colIndex; c++) {
                      slotIndex +=
                        COLUMN_PATTERN[c % COLUMN_PATTERN.length].length
                    }
                    slotIndex += i
                    const card = cards[slotIndex % cards.length]

                    return (
                      <article
                        key={i}
                        className={`group relative w-full overflow-hidden rounded-2xl ${aspectClass}`}
                        onMouseEnter={(e) => {
                          const video = e.currentTarget.querySelector('video')
                          if (video) video.play().catch(() => {})
                        }}
                        onMouseLeave={(e) => {
                          const video = e.currentTarget.querySelector('video')
                          if (video) video.pause()
                        }}
                      >
                        <div className="absolute inset-0">
                          <Media
                            media={card.media}
                            sizes="310px"
                            className="h-full w-full object-cover"
                            autoPlay={false}
                          />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex min-h-[93px] pt-12 flex-col items-start justify-end gap-4 p-6 bg-[linear-gradient(180deg,rgba(55,43,52,0)_0%,#372B34_100%)]">
                          <h4 className="font-title text-[24px] leading-none text-[#FBF2E9]">
                            {card.title}
                          </h4>
                          <div className="flex items-center gap-3">
                            {card.specialty && (
                              <div className="flex items-center gap-1 h-[14px]">
                                <svg
                                  width="9"
                                  height="9"
                                  viewBox="0 0 9 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.45 3.45L3.90607 5.00573C3.84749 5.06476 3.75251 5.06476 3.69393 5.00573L3.05 4.35688M7.61705 3.13653C7.49959 2.9798 7.43434 2.81 7.40824 2.61408L7.30383 1.89571C7.25163 1.51694 6.95147 1.21653 6.55995 1.15122L5.84217 1.04673C5.65946 1.02061 5.47675 0.942245 5.32015 0.837755L4.75897 0.419796C4.60237 0.302245 4.41966 0.25 4.23695 0.25C4.05424 0.25 3.87153 0.302245 3.71493 0.419796L3.1407 0.850816C2.98409 0.968367 2.81444 1.03367 2.61868 1.0598L1.91395 1.16429C1.53548 1.21653 1.23532 1.51694 1.17007 1.90878L1.06566 2.62714C1.03956 2.81 0.961256 2.99286 0.856852 3.14959L0.426183 3.72429C0.191272 4.03776 0.191272 4.46878 0.426183 4.76918L0.856852 5.34388C0.974307 5.50061 1.03956 5.67041 1.06566 5.86633L1.17007 6.58469C1.22227 6.96347 1.52243 7.26388 1.91395 7.32918L2.63173 7.43367C2.81444 7.4598 2.99715 7.53816 3.15375 7.64265L3.72798 8.07367C4.04119 8.30878 4.47186 8.30878 4.77202 8.07367L5.34625 7.64265C5.50285 7.5251 5.67251 7.4598 5.86827 7.43367L6.58605 7.32918C6.96452 7.27694 7.26468 6.97653 7.32993 6.58469L7.43434 5.86633C7.46044 5.68347 7.53874 5.50061 7.64315 5.34388L8.07382 4.76918C8.30873 4.45571 8.30873 4.02469 8.07382 3.72429L7.61705 3.13653Z"
                                    stroke="#FBF2E9"
                                    strokeWidth="0.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <span className="font-text text-[10px] leading-[14px] text-[#FBF2E9]">
                                  {card.specialty}
                                </span>
                              </div>
                            )}
                            {card.category && (
                              <div className="flex items-center gap-1 h-[14px]">
                                <svg
                                  width="9"
                                  height="9"
                                  viewBox="0 0 9 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.3131 7.9558L7.8021 5.4668M5.31299 5.46714L7.80199 7.95614"
                                    stroke="#FBF2E9"
                                    strokeWidth="0.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M0.301659 2.59301C0.339599 2.94763 0.624817 3.23285 0.979265 3.27235C1.24254 3.3017 1.51285 3.3269 1.78845 3.3269C2.06405 3.3269 2.33437 3.3017 2.59764 3.27236C2.95209 3.23285 3.23731 2.94763 3.27525 2.59301C3.30325 2.33122 3.32691 2.06246 3.32691 1.78845C3.32691 1.51445 3.30325 1.24568 3.27525 0.983896C3.23731 0.629277 2.95209 0.344058 2.59764 0.30455C2.33437 0.275204 2.06405 0.25 1.78845 0.25C1.51285 0.25 1.24254 0.275204 0.979265 0.30455C0.624817 0.344058 0.339599 0.629277 0.301659 0.983896C0.273651 1.24568 0.25 1.51445 0.25 1.78845C0.25 2.06246 0.273651 2.33122 0.301659 2.59301Z"
                                    stroke="#FBF2E9"
                                    strokeWidth="0.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M0.301659 7.5161C0.339599 7.87072 0.624817 8.15594 0.979265 8.19545C1.24254 8.2248 1.51285 8.25 1.78845 8.25C2.06405 8.25 2.33437 8.2248 2.59764 8.19545C2.95209 8.15594 3.23731 7.87072 3.27525 7.5161C3.30325 7.25432 3.32691 6.98555 3.32691 6.71155C3.32691 6.43754 3.30325 6.16878 3.27525 5.90699C3.23731 5.55237 2.95209 5.26715 2.59764 5.22765C2.33437 5.1983 2.06405 5.1731 1.78845 5.1731C1.51285 5.1731 1.24254 5.1983 0.979265 5.22765C0.624817 5.26715 0.339599 5.55237 0.301659 5.90699C0.273651 6.16878 0.25 6.43754 0.25 6.71155C0.25 6.98555 0.273651 7.25432 0.301659 7.5161Z"
                                    stroke="#FBF2E9"
                                    strokeWidth="0.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M5.07095 2.59301C5.10889 2.94763 5.3941 3.23285 5.74855 3.27235C6.01182 3.3017 6.28214 3.3269 6.55774 3.3269C6.83334 3.3269 7.10366 3.3017 7.36693 3.27236C7.72137 3.23285 8.00659 2.94763 8.04453 2.59301C8.07254 2.33122 8.09619 2.06246 8.09619 1.78845C8.09619 1.51445 8.07254 1.24568 8.04453 0.983896C8.00659 0.629277 7.72137 0.344058 7.36693 0.30455C7.10366 0.275204 6.83334 0.25 6.55774 0.25C6.28214 0.25 6.01182 0.275204 5.74855 0.30455C5.3941 0.344058 5.10889 0.629277 5.07095 0.983896C5.04294 1.24568 5.01929 1.51445 5.01929 1.78845C5.01929 2.06246 5.04294 2.33122 5.07095 2.59301Z"
                                    stroke="#FBF2E9"
                                    strokeWidth="0.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <span className="font-text text-[10px] leading-[14px] text-[#FBF2E9]">
                                  {card.category}
                                </span>
                              </div>
                            )}
                          </div>

                          {card.link?.url ? (
                            <PayloadLink
                              link={card.link as NonNullable<typeof card.link>}
                              className="flex w-full max-h-0 items-center justify-between overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-8 group-hover:opacity-100"
                            >
                              <span className="relative pb-1 font-text text-[12px] leading-none uppercase text-transparent bg-clip-text bg-[linear-gradient(90deg,#C05EC4_0%,#F0876B_100%)]">
                                Explore Concept
                                <span className="absolute bottom-0 left-0 h-px w-full bg-[linear-gradient(90deg,#C05EC4_0%,#F0876B_100%)]" />
                              </span>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <defs>
                                  <linearGradient
                                    id={`explore-grad-${i}`}
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                  >
                                    <stop stopColor="#C05EC4" />
                                    <stop offset="1" stopColor="#F0876B" />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M7 17L17 7"
                                  stroke={`url(#explore-grad-${i})`}
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7 7H17V17"
                                  stroke={`url(#explore-grad-${i})`}
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </PayloadLink>
                          ) : (
                            <div className="flex w-full max-h-0 items-center justify-between overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-8 group-hover:opacity-100">
                              <span className="relative pb-1 font-text text-[12px] leading-none uppercase text-transparent bg-clip-text bg-[linear-gradient(90deg,#C05EC4_0%,#F0876B_100%)]">
                                Explore Concept
                                <span className="absolute bottom-0 left-0 h-px w-full bg-[linear-gradient(90deg,#C05EC4_0%,#F0876B_100%)]" />
                              </span>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <defs>
                                  <linearGradient
                                    id={`explore-grad-div-${i}`}
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                  >
                                    <stop stopColor="#C05EC4" />
                                    <stop offset="1" stopColor="#F0876B" />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M7 17L17 7"
                                  stroke={`url(#explore-grad-div-${i})`}
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7 7H17V17"
                                  stroke={`url(#explore-grad-div-${i})`}
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              )
            },
          )}
        </div>
      ) : null}
    </section>
  )
}
