import type { ComponentType } from 'react'
import type { Block } from '@/types/blocks'
import { resolveSectionIds } from './section-ids'

// AUTO-MANAGED SECTION — block schema/component imports below are added by
// scripts/create-block.ts (bun run make:block) and renamed by scripts/rename-block.ts.
// Do not edit manually.
import { BlockMastheadBlock } from '@/payload/schema/blocks/block-masthead/schema.block'
import { BlockDetailBlock } from '@/payload/schema/blocks/block-detail/schema.block'
import { BlockHeroBlock } from '@/payload/schema/blocks/block-hero/schema.block'
import ContentsBlockMasthead from '@/payload/schema/blocks/block-masthead/component.block'
import ContentsBlockDetail from '@/payload/schema/blocks/block-detail/component.block'
import ContentsBlockHero from '@/payload/schema/blocks/block-hero/component.block'
import { BlockSpacerBlock } from '@/payload/schema/blocks/block-spacer/schema.block'
import ContentsBlockSpacer from '@/payload/schema/blocks/block-spacer/component.block'
import { BlockHomeMastheadBlock } from '@/payload/schema/blocks/block-home-masthead/schema.block'
import ContentsBlockHomeMasthead from '@/payload/schema/blocks/block-home-masthead/component.block'
import { BlockHomeServicesBlock } from '@/payload/schema/blocks/block-home-services/schema.block'
import ContentsBlockHomeServices from '@/payload/schema/blocks/block-home-services/component.block'
import { BlockHomeAboutBlock } from '@/payload/schema/blocks/block-home-about/schema.block'
import ContentsBlockHomeAbout from '@/payload/schema/blocks/block-home-about/component.block'
import { BlockHomePortfolioBlock } from '@/payload/schema/blocks/block-home-portfolio/schema.block'
import ContentsBlockHomePortfolio from '@/payload/schema/blocks/block-home-portfolio/component.block'
import { BlockHomeContactBlock } from '@/payload/schema/blocks/block-home-contact/schema.block'
import ContentsBlockHomeContact from '@/payload/schema/blocks/block-home-contact/component.block'
// AUTO-MANAGED SECTION END

type BlockProps<K extends Block['blockType']> = { id?: string } & Extract<
  Block,
  { blockType: K }
>

// Keys resolve from each block schema's slug (single source of truth),
// and payload generates blockType from the same slug, so lookup by
// block.blockType stays in sync with the schema constants.
// blockRegistry entries are auto-managed by scripts/create-block.ts and
// scripts/rename-block.ts — do not add/remove entries by hand.
const blockRegistry = {
  [BlockMastheadBlock.slug]: ContentsBlockMasthead,
  [BlockDetailBlock.slug]: ContentsBlockDetail,
  [BlockHeroBlock.slug]: ContentsBlockHero,
  [BlockSpacerBlock.slug]: ContentsBlockSpacer,
  [BlockHomeMastheadBlock.slug]: ContentsBlockHomeMasthead,
  [BlockHomeServicesBlock.slug]: ContentsBlockHomeServices,
  [BlockHomeAboutBlock.slug]: ContentsBlockHomeAbout,
  [BlockHomePortfolioBlock.slug]: ContentsBlockHomePortfolio,
  [BlockHomeContactBlock.slug]: ContentsBlockHomeContact,
} satisfies { [K in Block['blockType']]: ComponentType<BlockProps<K>> }

export default function PageBuilder({ blocks }: { blocks: Block[] }) {
  // Resolve a unique, renderable anchor per block. `sectionId` from the CMS
  // wins; duplicates within the same page get a numeric suffix so anchors
  // never collide. Logic lives in section-ids.ts (smoke-tested).
  const resolvedIds = resolveSectionIds(blocks)

  return (
    <>
      {blocks.map((block, index) => {
        const { id, ...blockProps } = block
        const Comp = blockRegistry[
          block.blockType as keyof typeof blockRegistry
        ] as unknown as ComponentType<Block & { id?: string }>

        if (!Comp) {
          if (process.env.NODE_ENV === 'development') {
            return (
              <div
                key={id ?? index}
                className="border border-red-500 p-4 text-red-500"
              >
                Unknown block type: {block.blockType}
              </div>
            )
          }
          return null
        }

        const slug = block.blockType
        return (
          <Comp
            key={`${slug}-${index}`}
            id={resolvedIds[index]}
            {...blockProps}
          />
        )
      })}
    </>
  )
}
