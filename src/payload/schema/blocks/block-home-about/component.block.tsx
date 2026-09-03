import MainButton from '@/components/common/button'
import SectionHeader from '@/components/common/section-header'
import BoxContainer from '@/components/container/boxed'
import MediaVisual from '@/components/common/media'
import { LightningIcon } from '@/components/icons/lightning'
import { RichText } from '@payloadcms/richtext-lexical/react'
import RedDot from '@/components/common/red-dot'
import type { Media } from '@/payload-types'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'

export type BlockHomeAboutProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

const mediaUrl = (
  img: string | Media | null | undefined,
): { src: string | null; alt: string } =>
  typeof img === 'string'
    ? { src: img || null, alt: '' }
    : { src: img?.url || null, alt: img?.alt ?? '' }

export default function ContentsBlockHomeAbout({
  id,
  title,
  description,
  actionButton,
  image,
}: BlockHomeAboutProps) {
  const { src, alt } = mediaUrl(image)
  return (
    <>
      <BoxContainer
        sectionClassName="py-8 md:py-20 relative"
        sectionId={id ?? 'about'}
      >
        <div className="flex flex-col md:flex-row z-[7]">
          {src ? (
            <div className="w-full left-0 absolute md:relative h-[460px] md:h-[629px] md:w-1/2 md:left-0">
              <MediaVisual
                media={image}
                alt={alt}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="mix-blend-lighten object-cover"
              />
            </div>
          ) : null}
          <div className="text-left w-full md:w-1/2 md:m-auto z-[8] flex flex-col gap-4 md:gap-10 pt-[290px] md:pt-0">
            <SectionHeader label={title} />
            {description ? <RichText data={description} /> : null}
            <div>
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
                    <LightningIcon />
                  </span>
                </MainButton>
              ) : null}
            </div>
          </div>
        </div>
        <RedDot containerClass="absolute bottom-[10%] left-[-40%] lg:bottom-[-80%] lg:left-[-50%] z-[7]" />
      </BoxContainer>
    </>
  )
}
