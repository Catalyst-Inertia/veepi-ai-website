import BoxContainer from '@/components/container/boxed'
import { RichText } from '@payloadcms/richtext-lexical/react'
import PayloadLink from '@/components/common/payload-link'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'

export type BlockDetailProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockDetail({
  id,
  title,
  content,
  actionButton,
}: BlockDetailProps) {
  return (
    <section id={id ?? 'detail'} className="relative w-full">
      <BoxContainer
        sectionClassName="bg-transparent"
        containerClassName="vertical-padding flex flex-col gap-8"
      >
        {title ? <h2 className="heading-3">{title}</h2> : null}
        {content ? <RichText data={content} /> : null}
        {actionButton.url ? (
          <PayloadLink
            link={actionButton}
            className={
              actionButton.variant === 'secondary'
                ? 'inline-flex w-fit items-center border border-white_color px-8 py-4 text-sm font-bold uppercase tracking-[2px] text-white hover:opacity-80'
                : actionButton.variant === 'link'
                  ? 'inline-flex w-fit items-center text-sm font-bold uppercase tracking-[2px] text-white underline underline-offset-4 hover:opacity-80'
                  : 'inline-flex w-fit items-center bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[2px] text-white hover:opacity-80'
            }
          >
            {actionButton.label}
          </PayloadLink>
        ) : null}
      </BoxContainer>
    </section>
  )
}
