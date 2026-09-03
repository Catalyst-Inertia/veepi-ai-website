import PortfolioCard from '@/components/common/portfolio-card'
import BoxContainer from '@/components/container/boxed'
import SectionHeader from '@/components/common/section-header'
import {
  getCaseStudiesPosts,
  getSelectedCaseStudyPosts,
} from '@/cms/data/action'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import RedDot from '@/components/common/red-dot'
import type { Media, Post } from '@/payload-types'
import type { Block } from '@/types/blocks'

import PayloadLink from '@/components/common/payload-link'
import s from './index.module.scss'
import { IDENTIFIER } from './schema.block'

export type BlockHomePortfolioProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

const mediaUrl = (
  img: string | Media | null | undefined,
): { src: string | null; alt: string } =>
  typeof img === 'string'
    ? { src: img || null, alt: '' }
    : { src: img?.url || null, alt: img?.alt ?? '' }

// Case studies feed: the block's selected posts in editor order when curated
// (array of { post } rows, drag-reorderable in admin), otherwise the default
// projects feed (/works, falling back to legacy /projects) — resolved in
// getSelectedCaseStudyPosts / getCaseStudiesPosts (src/cms/data/action.ts).
export default async function ContentsBlockHomePortfolio({
  id,
  title,
  description,
  viewMoreImage,
  posts,
  actionButton,
}: BlockHomePortfolioProps) {
  // Case studies feed: the block's selected posts in editor order when curated
  // (array of { post } rows, drag-reorderable in admin), otherwise the default
  // projects feed (/works, falling back to legacy /projects) — resolved in
  // getSelectedCaseStudyPosts / getCaseStudiesPosts (src/cms/data/action.ts).
  const selectedIds = (posts ?? []).map((row) => {
    const p = row.post
    return String(typeof p === 'object' && p !== null && 'id' in p ? p.id : p)
  })
  const feed = selectedIds.length
    ? await getSelectedCaseStudyPosts(selectedIds)
    : await getCaseStudiesPosts()
  const { src, alt } = mediaUrl(viewMoreImage)
  return (
    <BoxContainer
      sectionClassName="py-8 lg:py-20 relative"
      sectionId={id ?? 'portfolio'}
    >
      <div className="text-center lg:w-[50%] m-auto flex flex-col gap-4 lg:gap-10">
        <SectionHeader label={title} />
        {description ? (
          <div className="font-sans">
            <RichText data={description} />
          </div>
        ) : null}
      </div>
      <div className="mt-8 lg:mt-10 z-20 relative">
        <div
          className={`flex flex-nowrap overflow-auto whitespace-nowrap gap-6 p-4 ${s.hideSscrollbar}`}
        >
          {feed.slice(0, 2).map((post: Post, index) => {
            const ogImage = post.seo?.og_image
            const thumb =
              typeof ogImage === 'object' && ogImage !== null && ogImage.url
                ? ogImage.url
                : null
            if (!thumb) return null
            const tags =
              typeof post.seo?.keywords === 'string'
                ? post.seo.keywords
                    .split(',')
                    .map((tag: string) => tag.trim())
                    .filter(Boolean)
                : []
            return (
              <div key={post.id} className="flex-1 min-w-0">
                <PortfolioCard
                  className="h-full"
                  project={{
                    id: index + 1,
                    title: post.title,
                    tags,
                    thumbnail: thumb,
                    description: '',
                  }}
                />
              </div>
            )
          })}
          {actionButton?.url ? (
            <PayloadLink
              link={actionButton}
              className={`${s.view_more} w-[200px] shrink-0`}
            >
              <div className="w-full">
                <h4 className="w-full h-fit">
                  {actionButton.label
                    ? actionButton.label
                        .split(' ')
                        .map((word: string, i: number, arr: string[]) => (
                          <span key={i}>
                            {word}
                            {i < arr.length - 1 ? <br /> : null}
                          </span>
                        ))
                    : 'Discover More'}
                </h4>
                {src ? (
                  <div
                    className={`w-full h-full relative ${s.view_more_image}`}
                  >
                    <Image
                      src={src}
                      alt={alt}
                      width={900}
                      height={900}
                      style={{ objectFit: 'contain' }}
                      className="max-w-[240px] lg:max-w-[370px] absolute"
                    />
                  </div>
                ) : null}
              </div>
            </PayloadLink>
          ) : null}
        </div>
      </div>
      <RedDot containerClass="absolute bottom-[5%] right-[-10%] lg:bottom-[-30%] lg:right-[-20%] z-10" />
    </BoxContainer>
  )
}
