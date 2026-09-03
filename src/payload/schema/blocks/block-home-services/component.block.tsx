'use client'

import BoxContainer from '@/components/container/boxed'
import MediaVisual from '@/components/common/media'
import RunningText from '@/components/common/running-text'
import RedDot from '@/components/common/red-dot'
import MainButton from '@/components/common/button'
import ServiceCard from '@/components/common/service-card'
import SectionHeader from '@/components/common/section-header'
import { KeyCheckIcon } from '@/components/icons/key-check'
import useScreenSize from '@/hooks/ui/screen-size'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'
import type { Block } from '@/types/blocks'

import s from './index.module.scss'
import { IDENTIFIER } from './schema.block'

export type BlockHomeServicesProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

const mediaUrl = (
  img: string | Media | null | undefined,
): { src: string | null; alt: string } =>
  typeof img === 'string'
    ? { src: img || null, alt: '' }
    : { src: img?.url || null, alt: img?.alt ?? '' }

export default function ContentsBlockHomeServices({
  id,
  title,
  description,
  services,
  actionButton,
  runningText,
  image,
}: BlockHomeServicesProps) {
  const { isTablet } = useScreenSize()
  const { src, alt } = mediaUrl(image)
  const items =
    (runningText ?? []).length > 0
      ? (runningText ?? []).map((row) => row.item)
      : undefined

  return (
    <BoxContainer sectionClassName="relative py-8" sectionId={id ?? 'services'}>
      <div className="relative z-[10] mb-28 flex flex-col gap-8 lg:gap-20">
        <div className="flex flex-col gap-4 lg:gap-10 text-center lg:w-[50%] m-auto">
          <SectionHeader label={title} />
          {description ? (
            <div>
              <RichText data={description} />
            </div>
          ) : null}
        </div>

        <div className="z-[10] mb-56 lg:mb-0">
          {isTablet ? (
            <div
              className={`px-4 py-6 snap-x flex flex-row gap-4 overflow-x-auto ${s.hideSscrollbar}`}
            >
              {(services ?? []).map((item, index) => (
                <div key={index} className="!text-white snap-start scroll-ml-6">
                  <ServiceCard
                    title={item.title}
                    description={item.description}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <div className="grid grid-cols-4 gap-8">
                {(services ?? []).map((item, index) => (
                  <div
                    key={index}
                    className={`${
                      (index % 4 === 0 || index % 4 === 3) && 'mt-[150px]'
                    }`}
                  >
                    <ServiceCard
                      title={item.title}
                      description={item.description}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="z-[10] flex justify-center">
          {actionButton.url ? (
            <MainButton
              href={actionButton.url}
              linkType={actionButton.type}
              newTab={actionButton.newTab || false}
              type={
                actionButton.variant === 'secondary'
                  ? 'secondary'
                  : actionButton.variant === 'link'
                    ? 'outlined'
                    : 'primary'
              }
            >
              {actionButton.label}
              <span className="ml-4">
                <KeyCheckIcon width={24} height={24} stroke="currentColor" />
              </span>
            </MainButton>
          ) : null}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-[8]">
        {src ? (
          <div className="relative w-full h-[500px] lg:h-[1000px]">
            <MediaVisual
              media={image}
              alt={alt}
              sizes="100vw"
              objectFit="contain"
            />
          </div>
        ) : null}
        <div className="absolute bottom-0 w-full">
          <RunningText items={items} />
        </div>
      </div>

      <RedDot containerClass="absolute bottom-[-10%] left-[50%] lg:bottom-[-20%] lg:right-[-50%] !z-[7]" />
    </BoxContainer>
  )
}
