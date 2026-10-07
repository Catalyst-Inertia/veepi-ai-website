import React from 'react'
import Media from '@/components/common/media'
import PayloadLink from '@/components/common/payload-link'
import type { BlockGalleryProps } from '../component.block'

export type GalleryModalProps = {
  selectedCard: NonNullable<BlockGalleryProps['cards']>[number]
  onClose: () => void
}

export function GalleryModal({ selectedCard, onClose }: GalleryModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/90 p-4 lg:p-0 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-50 p-2 text-white/50 hover:text-white transition-colors"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="relative flex w-full max-w-[1312px] flex-col lg:flex-row items-center justify-center gap-6">
        {/* Left: Video Placeholder */}
        <div className="relative w-full overflow-hidden rounded-[40px] lg:w-[978px] aspect-video lg:h-[550px]">
          <Media
            controls
            media={selectedCard.media}
            sizes="(max-width: 1024px) 100vw, 978px"
            className="h-full w-full object-cover"
            autoPlay={true}
            muted={false}
          />
        </div>

        {/* Right: Text content */}
        <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[310px]">
          <h3 className="font-title text-[48px] leading-[48px] text-[#FBF2E9]">
            {selectedCard.title}
          </h3>

          <p className="font-text text-[16px] leading-[24px] text-[#FBF2E9]">
            {selectedCard.cardDescription ||
              'A transformation concept built around reflection and reveal.'}
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-center">
              <span className="font-text text-[16px] font-extrabold leading-[24px] text-[#FBF2E9]">
                Best for
              </span>
              <span className="font-text text-[16px] leading-[24px] text-[#FBF2E9]">
                {selectedCard.bestFor ||
                  selectedCard.specialty ||
                  'Facial procedures'}
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-text text-[16px] font-extrabold leading-[24px] text-[#FBF2E9]">
                Input
              </span>
              <span className="font-text text-[16px] leading-[24px] text-[#FBF2E9]">
                {selectedCard.input || 'Before & after imagery'}
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-text text-[16px] font-extrabold leading-[24px] text-[#FBF2E9]">
                Output
              </span>
              <span className="font-text text-[16px] leading-[24px] text-[#FBF2E9]">
                {selectedCard.output || 'Short-form social video'}
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-text text-[16px] font-extrabold leading-[24px] text-[#FBF2E9]">
                Formats
              </span>
              <span className="font-text text-[16px] leading-[24px] text-[#FBF2E9]">
                {selectedCard.formats || '9:16 · 1:1 · 16:9'}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {selectedCard.actionButton && (
            <PayloadLink
              link={selectedCard.actionButton}
              onClick={onClose}
              className="group relative mt-2 flex w-[265px] h-[48px] items-center justify-between rounded-xl border border-white/20 bg-transparent px-6 py-2 transition-all hover:bg-white/5"
            >
              <span className="font-text text-[10px] font-bold leading-none uppercase tracking-[2px] text-[#FBF2E9]">
                {selectedCard.actionButton.label ||
                  'CREATE SOMETHING LIKE THIS'}
              </span>
              <span className="flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"
                    fill="#FBF2E9"
                  />
                  <path
                    d="M19 14L20 17L23 18L20 19L19 22L18 19L15 18L18 17L19 14Z"
                    fill="#FBF2E9"
                  />
                </svg>
              </span>
            </PayloadLink>
          )}
        </div>
      </div>
    </div>
  )
}
