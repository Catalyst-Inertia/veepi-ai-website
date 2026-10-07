import React, { useRef, useState, useEffect } from 'react'
import Media from '@/components/common/media'
import type { BlockGalleryProps } from '../component.block'
function AiSearchIcon() {
  return (
    <svg
      width="24"
      height="24"
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
  )
}

const COLUMN_PATTERN: ReadonlyArray<{ col: string; cards: string[] }> = [
  { col: '', cards: ['h-[174px]', 'h-[348px]'] },
  { col: 'h-[546px]', cards: ['aspect-square', 'flex-1 min-h-0'] },
  { col: 'h-[546px]', cards: ['flex-1 min-h-0', 'flex-1 min-h-0'] },
  {
    col: 'h-[546px]',
    cards: ['flex-1 min-h-0', 'flex-1 min-h-0', 'flex-1 min-h-0'],
  },
] as const
const TILE_REPEAT = 3

export type GalleryStripProps = {
  cards: NonNullable<BlockGalleryProps['cards']>
  selectedCard: NonNullable<BlockGalleryProps['cards']>[number] | null
  onSelectCard: (
    card: NonNullable<BlockGalleryProps['cards']>[number] | null,
  ) => void
}

export function GalleryStrip({
  cards,
  selectedCard,
  onSelectCard,
}: GalleryStripProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const pausedRef = useRef(false)

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    const SPEED = 50 // px per second

    const groupWidth = () => {
      if (strip.children.length > COLUMN_PATTERN.length) {
        const first = strip.children[0] as HTMLElement
        const nextGroup = strip.children[COLUMN_PATTERN.length] as HTMLElement
        return nextGroup.offsetLeft - first.offsetLeft
      }
      return 0
    }

    let lastTime = performance.now()
    let rafId: number
    let exactScroll = strip.scrollLeft

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const w = groupWidth()
      if (w > 0) {
        // Sync exactScroll if DOM was mutated by user scroll/drag
        if (Math.abs(exactScroll - strip.scrollLeft) > 1) {
          exactScroll = strip.scrollLeft
        }

        if (!pausedRef.current && !isDown.current) {
          exactScroll += SPEED * dt
          strip.scrollLeft = exactScroll
        }

        // Bidirectional Wrap
        if (strip.scrollLeft > w) {
          strip.scrollLeft -= w
          exactScroll -= w
          if (isDown.current) scrollLeft.current -= w
        } else if (strip.scrollLeft <= 0) {
          // When hitting the left boundary, wrap to the right
          strip.scrollLeft += w
          exactScroll += w
          if (isDown.current) scrollLeft.current += w
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    pausedRef.current = false // Never pause
  }, [selectedCard])

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
          const pattern = COLUMN_PATTERN[colIndex % COLUMN_PATTERN.length]

          return (
            <div
              key={colIndex}
              className={`flex w-[310px] shrink-0 flex-col gap-6 ${pattern.col}`}
            >
              {pattern.cards.map((cardClass, i) => {
                // Calculate linear slot index to pick the card cyclically
                // Number of cards in previous columns
                let slotIndex = 0
                for (let c = 0; c < colIndex; c++) {
                  slotIndex +=
                    COLUMN_PATTERN[c % COLUMN_PATTERN.length].cards.length
                }
                slotIndex += i
                const card = cards[slotIndex % cards.length]

                return (
                  <article
                    key={i}
                    onClick={() => !isDragging && onSelectCard(card)}
                    className={`group relative w-full overflow-hidden rounded-2xl cursor-pointer border border-white/50 ${cardClass}`}
                  >
                    <div className="absolute inset-0">
                      <Media
                        media={card.media}
                        sizes="310px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-end gap-3 p-6 bg-gradient-to-b from-[rgba(55,43,52,0)] to-[#372b34]">
                      <div className="flex items-center gap-2 w-full">
                        <div className="relative shrink-0 size-6">
                          <AiSearchIcon />
                        </div>
                        <h4 className="font-title text-[24px] leading-6 text-[#FBF2E9]">
                          {card.title}
                        </h4>
                      </div>
                      <div className="flex flex-col gap-4 w-full max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-[150px] group-hover:opacity-100">
                        {card.cardDescription && (
                          <p className="font-text text-[14px] leading-5 text-[#FBF2E9]/80">
                            {card.cardDescription}
                          </p>
                        )}
                        <div className="flex w-full items-center justify-between">
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
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )
        },
      )}
    </div>
  )
}
