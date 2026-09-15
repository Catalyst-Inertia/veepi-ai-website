import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'
import { RichText } from '@payloadcms/richtext-lexical/react'
import PayloadLink from '@/components/common/payload-link'
import Media from '@/components/common/media'
import BoxContainer from '@/components/container/boxed'

export type BlockHeroProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockHero(props: BlockHeroProps) {
  const { id, backgroundMedia, title, description, logos, cta } = props

  return (
    <section
      id={id}
      className="bg-black-color relative w-full h-screen overflow-hidden flex flex-col"
    >
      {/* Background media + gradient scrim */}
      <div className="absolute inset-0 z-0">
        {backgroundMedia && (
          <Media media={backgroundMedia} objectFit="cover" priority />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(23,21,21,0.55)_0%,rgba(23,21,21,0.15)_25%,rgba(23,21,21,0.10)_55%,rgba(23,21,21,0.80)_100%)]" />
      </div>

      {/* Title — dead center */}
      <style>{`
        .hero-title p { font-size: 36px; }
        @media (min-width: 768px) { .hero-title p { font-size: 80px; } }
        @media (min-width: 1024px) { .hero-title p { font-size: 100px; } }
        .hero-tagline p { font-size: 13px; }
      `}</style>
      <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4">
        {title && (
          <div className="hero-title font-title leading-[1.05] text-[#FBF2E9] w-full max-w-[1000px]">
            <RichText data={title} />
          </div>
        )}
      </div>

      {/* Bottom bar: tagline + logos left, CTA right */}
      <div className="relative z-10 pb-10 md:pb-12">
        <BoxContainer>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-4 text-[#FBF2E9]">
              {description && (
                <div className="hero-tagline leading-snug max-w-[600px]">
                  <RichText data={description} />
                </div>
              )}
              {logos && logos.length > 0 && (
                <div className="flex items-center gap-6">
                  {logos.map((item, i) =>
                    item.logo ? (
                      <div key={i} className="relative h-[20px] w-[326px]">
                        <Media media={item.logo} objectFit="contain" />
                      </div>
                    ) : null,
                  )}
                </div>
              )}
            </div>

            {cta?.url && (
              <PayloadLink
                link={{
                  label: '',
                  type: cta.type,
                  url: cta.url,
                  newTab: cta.newTab ?? false,
                }}
                className="flex items-center gap-2 px-4 py-[10px] rounded-[8px] backdrop-blur-md bg-white/10 border border-white/25 hover:bg-white/20 transition-all duration-300 self-start md:self-auto shrink-0 whitespace-nowrap"
              >
                <span className="font-text text-[10px] leading-none uppercase tracking-[0.04em] text-[#FBF2E9]">
                  {cta.label}
                </span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 20 20"
                  fill="#FBF2E9"
                  aria-hidden="true"
                >
                  <path d="M10 1 L11.9 8.1 L19 10 L11.9 11.9 L10 19 L8.1 11.9 L1 10 L8.1 8.1 Z" />
                  <path d="M17 13 l0.8 2.2 2.2 0.8 -2.2 0.8 -0.8 2.2 -0.8 -2.2 -2.2 -0.8 2.2 -0.8 Z" />
                </svg>
              </PayloadLink>
            )}
          </div>
        </BoxContainer>
      </div>
    </section>
  )
}
