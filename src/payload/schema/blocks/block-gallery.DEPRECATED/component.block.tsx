'use client'

import React, { useState } from 'react'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'
import { GalleryHeader } from './_components/gallery-header'
import { GalleryStrip } from './_components/gallery-strip'
import { GalleryModal } from './_components/gallery-modal'

export type BlockGalleryProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockGallery({
  id,
  title,
  description,
  cards,
}: BlockGalleryProps) {
  const [selectedCard, setSelectedCard] = useState<
    NonNullable<BlockGalleryProps['cards']>[number] | null
  >(null)

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
      <GalleryHeader title={title} description={description} />

      {/* Strip */}
      {cards?.length ? (
        <GalleryStrip
          cards={cards}
          selectedCard={selectedCard}
          onSelectCard={setSelectedCard}
        />
      ) : null}

      {/* Modal */}
      {selectedCard && (
        <GalleryModal
          selectedCard={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </section>
  )
}
