import { RichText } from '@payloadcms/richtext-lexical/react'
import type { BlockHomeServicesBlock } from '@/payload-types'
import s from './index.module.scss'

type serviceCardProp = {
  title: string
  description: NonNullable<
    NonNullable<BlockHomeServicesBlock['services']>[number]['description']
  >
}

export default function ServiceCard(prop: serviceCardProp) {
  const { title, description } = prop
  return (
    <div
      className={`w-[300px] h-[300px] flex items-center text-center md:text-left h-full ${s.container}`}
    >
      <div className="text-center">
        <div>
          <h4 className="font-semibold">{title}</h4>
        </div>
        <div className="mt-6">
          <RichText data={description} />
        </div>
      </div>
    </div>
  )
}
