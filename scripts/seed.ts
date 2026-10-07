/* eslint-disable no-console -- seed script */
import payload from 'payload'
import config from '../payload.config'
import { seedGlobals } from '../seed/globals'
import { seedPages } from '../seed/pages'

async function main(): Promise<void> {
  await payload.init({ config })
  await seedGlobals()
  await seedPages()
  console.log('Seed complete.')
}

void main()
  .catch((err: unknown) => {
    console.error('Seed failed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await payload.db?.destroy?.()
    } catch {
      /* best effort */
    }
  })
