'use client'

import { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Block } from '@/types/blocks'
import { IDENTIFIER } from './schema.block'

export type BlockHowItWorksProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>
export default function ContentsBlockHowItWorks({
  id,
  title,
  description,
  steps,
}: BlockHowItWorksProps) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id={id} className="w-full bg-[#FBF2E9] pt-[120px] pb-[124px]">
      <div className="mx-auto max-w-[1312px] px-6 min-[1440px]:px-0">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:justify-between">
          <h2 className="whitespace-pre-line font-title text-[40px] md:text-[64px] min-[1440px]:text-[72px] leading-none text-[#372B34] flex-1">
            {title}
          </h2>

          <div className="flex w-full shrink-0 flex-col items-start lg:items-end gap-4 lg:w-[421px]">
            {/* Dotted tag */}
            <div className="relative flex items-center gap-6 rounded-[40px] border border-[#372B34]/10 py-2 pl-2 pr-8 bg-white/50">
              <span className="flex h-6 w-6 items-center justify-center rounded-[18px] border-[1.2px] border-white/15 bg-[linear-gradient(225deg,#F0876B_0%,#C05EC4_100%)] p-[4.8px]">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="7.5"
                    cy="7.5"
                    r="4.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="2 2"
                  />
                </svg>
              </span>
              <span className="font-text text-[10px] font-extrabold uppercase tracking-[8px] text-[#372B34]">
                HOW IT WORKS
              </span>
              <div className="absolute left-[19.3%] right-[18.7%] top-0 h-px bg-[linear-gradient(90deg,rgba(192,94,196,0)_0%,#C05EC4_50%,rgba(192,94,196,0)_100%)]" />
            </div>
            {description && (
              <div className="w-full text-left lg:text-right font-text text-[16px] leading-6 text-[#6E6155] [&_p]:m-0">
                <RichText data={description} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 lg:flex-row lg:items-start">
          <div className="relative flex-1 lg:pr-10">
            <div className="absolute bottom-5 left-[19px] top-5 w-px border-l border-dashed border-[#C8C8C8]" />
            <div className="relative z-10 flex flex-col gap-4">
              {steps?.map((step, index) => {
                const open = openIndex === index

                return (
                  <button
                    key={index}
                    type="button"
                    className="flex flex-col text-left group"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-text text-[16px] font-extrabold transition-all duration-300 ${
                          open
                            ? 'bg-[linear-gradient(225deg,#F0876B_0%,#C05EC4_100%)] text-white ring-2 ring-white/15'
                            : 'border-2 border-[#C8C8C8] bg-[#FBF2E9] text-[#C8C8C8]'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <h3
                        className={`flex-1 font-title transition-all duration-300 ${
                          open
                            ? 'text-[32px] leading-[32px] md:text-[48px] md:leading-[48px] text-[#372B34]'
                            : 'text-[24px] leading-[24px] md:text-[32px] md:leading-[32px] text-[#C8C8C8]'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <div
                        className={`shrink-0 transition-transform duration-300 ${
                          open ? 'rotate-180 text-[#6E6155]' : 'text-[#C8C8C8]'
                        }`}
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
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div
                      className="grid w-full transition-[grid-template-rows] duration-300"
                      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <div
                          className={`pl-14 pt-0 font-text text-[16px] leading-6 text-[#6E6155] transition-opacity duration-300 ${
                            open ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="w-full shrink-0 overflow-hidden rounded-[16px] h-[240px] md:h-[334px] lg:h-[334px] lg:w-[644px] [filter:drop-shadow(0_0_40px_rgba(240,135,107,0.3))] relative">
            <video
              src="/videos/howitwork.webm"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
