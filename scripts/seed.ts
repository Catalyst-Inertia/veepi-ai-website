/* eslint-disable no-console -- seed script */
import payload from 'payload'
import config from '../payload.config'
import { seedHomepage } from '../seed/homepage'
import { seedGlobals } from '../seed/globals'

async function main(): Promise<void> {
  await payload.init({ config })
  await seedHomepage()
  await seedGlobals()
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
