import BoxContainer from '@/components/container/boxed'
import ChevronRight from '@/components/icons/chevron'
import Image from 'next/image'
import React from 'react'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'

export type BlockMastheadProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockMasthead({
  id,
  title,
  eyebrow,
  minicaps = [],
  image,
}: BlockMastheadProps) {
  const imageSrc =
    typeof image === 'object' && image !== null && image.url
      ? image.url
      : undefined
  const imageAlt =
    typeof image === 'object' && image !== null && image.alt
      ? image.alt
      : 'masthead'
  const breadcrumbs = [
    ...(eyebrow ? [eyebrow] : []),
    ...(minicaps ?? []).map((m) => m.item),
  ]

  return (
    <section
      id={id ?? 'masthead'}
      className="relative w-full h-screen max-h-[800px]"
    >
      {imageSrc ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative h-full">
            <Image
              src={imageSrc}
              fill
              alt={imageAlt}
              className="object-cover z-10"
            />
          </div>
        </div>
      ) : null}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10
        bg-[linear-gradient(to_top_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.8)_25%,rgba(0,0,0,0.2)_100%)]
        md:bg-[linear-gradient(to_top_right,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_20%,rgba(0,0,0,0.8)_25%,rgba(0,0,0,0)_50%,transparent_100%)]"
      />

      <BoxContainer
        sectionClassName="bg-transparent!"
        containerClassName="relative !py-[60px] lg:!py-[102px] gap-[40px] h-screen max-h-[800px] z-20 flex h-full flex-col items-start! justify-end"
      >
        <div className="mini-caps flex items-center text-sm tracking-[2px] flex-wrap font-bold font-text text-white uppercase !max-w-[950px]">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <span>{item}</span>
              {index !== breadcrumbs.length - 1 && <ChevronRight />}
            </React.Fragment>
          ))}
        </div>
        <h1 className="heading-2 text-white w-full !max-w-[950px]">{title}</h1>
      </BoxContainer>
    </section>
  )
}
