import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'

export type BlockHeroProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockHero({ id }: BlockHeroProps) {
  return <section id={id} className="relative w-full" />
}
