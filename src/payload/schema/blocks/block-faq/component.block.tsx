'use client'

import { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'

export type BlockFaqProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockFaq({
  id,
  title,
  questions,
}: BlockFaqProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <section
      id={id}
      className="w-full bg-[#FBF2E9] px-5 pb-24 pt-10 md:px-10 md:pb-32"
    >
      <div className="flex flex-col items-center gap-8 text-center">
        {/* Eyebrow pill */}
        <div className="relative flex h-10 items-center gap-6 rounded-[40px] border border-white/5 pl-2 pr-8 bg-[linear-gradient(0.56deg,rgba(192,94,196,0.1)_0%,rgba(240,135,107,0.1)_100%)]">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(225deg,#F0876B_0%,#C05EC4_100%)] ring-1 ring-white/15">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="7" cy="7" r="6.5" stroke="#FBF2E9" strokeWidth="1" />
              <circle cx="7" cy="7" r="2.5" stroke="#FBF2E9" strokeWidth="1" />
            </svg>
          </div>
          <span className="font-text text-[10px] font-extrabold uppercase tracking-[8px] text-[#372B34]">
            FAQ
          </span>
          <div className="absolute left-[19.3%] right-[18.7%] top-0 h-px bg-[linear-gradient(90deg,rgba(192,94,196,0)_0%,#C05EC4_50%,rgba(192,94,196,0)_100%)]" />
        </div>

        {/* Headline */}
        <h2 className="font-title text-[40px] leading-none text-[#372B34] md:text-[72px]">
          {title}
        </h2>
      </div>

      <div className="mx-auto mt-20 flex w-full max-w-[866px] flex-col">
        {questions?.map((item, index) => {
          const key = item.id ?? String(index)
          const open = openItems.has(key)

          return (
            <button
              key={key}
              type="button"
              className="flex w-full items-center gap-6 border-b border-[#372B34] py-8 text-left md:gap-16"
              aria-expanded={open}
              onClick={() => toggle(key)}
            >
              <div className="flex grow flex-col">
                <span className="font-title text-[28px] leading-[1] text-[#372B34] md:text-[48px]">
                  {item.question}
                </span>

                <div
                  className="grid transition-[grid-template-rows] duration-300"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    {item.answer && (
                      <div className="pt-2 font-text text-[16px] leading-[24px] text-[#6E6155] [&_p]:m-0">
                        <RichText data={item.answer} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <div
                  className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="#372B34"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
