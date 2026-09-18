/* eslint-disable no-console -- migration report script */
import payload from 'payload'
import config from '../payload.config'
import { buildPricingBlock } from '../seed/homepage'
import type { Page } from '../src/payload-types'

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply')
  await payload.init({ config })

  const res = await payload.find({
    collection: 'pages',
    where: { isHomepage: { equals: true } },
    limit: 1,
    depth: 0,
  })

  const hp = res.docs[0]
  if (!hp) {
    console.log('No homepage found with isHomepage: true.')
    process.exit(0)
  }

  const contents = hp.contents || []
  if (contents.some((b) => b.blockType === 'block-pricing')) {
    console.log('Homepage already contains block-pricing — nothing to do.')
    process.exit(0)
  }

  const pricingBlock = buildPricingBlock()

  const mediaRes = await payload.find({
    collection: 'media',
    where: { alt: { equals: 'Partner Logos' } },
    limit: 1,
    depth: 0,
  })

  if (mediaRes.docs[0]) {
    const id = mediaRes.docs[0].id
    pricingBlock.logos = [{ logo: id }, { logo: id }, { logo: id }]
  }

  const newContents = [...contents]
  const heroIndex = newContents.findIndex((b) => b.blockType === 'block-hero')

  if (heroIndex >= 0) {
    newContents.splice(heroIndex + 1, 0, pricingBlock)
  } else {
    newContents.push(pricingBlock)
  }

  console.log(`Will insert block-pricing (after index ${heroIndex})`)

  if (!apply) {
    console.log('\nDry run — pass --apply to write changes')
    process.exit(0)
  }

  await payload.update({
    collection: 'pages',
    id: hp.id,
    data: { contents: newContents as Page['contents'] },
  })

  console.log(`\nApplied: Inserted pricing block into homepage (${hp.id})`)
  process.exit(0)
}

void main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
