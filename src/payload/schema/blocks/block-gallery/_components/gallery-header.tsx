import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { BlockGalleryProps } from '../component.block'

export type GalleryHeaderProps = {
  title: string
  description?: BlockGalleryProps['description']
}

export function GalleryHeader({ title, description }: GalleryHeaderProps) {
  return (
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
  )
}
