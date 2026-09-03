import MainButton from '@/components/common/button'
import RedDot from '@/components/common/red-dot'
import BoxContainer from '@/components/container/boxed'
import MediaVisual from '@/components/common/media'
import { MagicWandIcon } from '@/components/icons/magic-wand'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'

export type BlockHomeMastheadProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

const mediaUrl = (
  img: string | Media | null | undefined,
): { src: string | null; alt: string } =>
  typeof img === 'string'
    ? { src: img || null, alt: '' }
    : { src: img?.url || null, alt: img?.alt ?? '' }

export default function ContentsBlockHomeMasthead({
  id,
  title,
  description,
  actionButton,
  image,
}: BlockHomeMastheadProps) {
  const { src, alt } = mediaUrl(image)
  return (
    <BoxContainer
      sectionClassName="pb-8 lg:pt-[250px] lg:pb-36"
      sectionId={id ?? 'masthead'}
    >
      <div className="h-[600px] lg:h-auto flex gap-8 justify-between items-center">
        <div className="flex flex-col h-full justify-end pb-8 md:w-3/4 lg:items-baseline lg:w-1/2 z-10">
          <h1 className="mb-6">{title}</h1>
          {description ? (
            <div className="leading-tight">
              <RichText data={description} />
            </div>
          ) : null}
          <div className="pt-6">
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
                  <MagicWandIcon />
                </span>
              </MainButton>
            ) : null}
          </div>
        </div>
        {src ? (
          <div
            className="mix-blend-lighten opacity-80 
          w-full md:w-1/2 lg:w-1/2 h-screen absolute right-0 overflow-hidden
          z-[5] pointer-events-none top-[-25%] md:top-[-10%] lg:top-[-15%]
        "
          >
            <MediaVisual
              media={image}
              alt={alt}
              sizes="(min-width: 768px) 50vw, 100vw"
              objectFit="contain"
              className="rotate-[45deg] w-full scale-150"
            />
          </div>
        ) : null}
      </div>
      <RedDot containerClass="absolute bottom-[15%] left-[-100%] md:bottom-[15%] md:left-[-20%] lg:bottom-[-50%] lg:left-[-20%] !z-[7]" />
    </BoxContainer>
  )
}
