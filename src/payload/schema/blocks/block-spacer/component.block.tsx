import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'

export type BlockSpacerProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

// Blank black breathing room — fixed 60vh, renders between content sections.
// Hairline top/bottom borders keep the section visible against the black bg.
export default function ContentsBlockSpacer({ id }: BlockSpacerProps) {
  return (
    <section
      id={id}
      className="relative h-[60vh] w-full bg-black_color border-y border-solid border-white/10"
    />
  )
}
