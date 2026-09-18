/* eslint-disable no-console -- seed entry */
import payload from 'payload'
import config from '../payload.config'
import { seedHomepage } from './homepage'
import { seedProjects } from './projects'
import { seedGlobals } from './globals'

async function main(): Promise<void> {
  await payload.init({ config })
  // Projects group first: the homepage's case-studies block pins its feed to
  // the projects group, so the group must exist before the homepage seeds.
  await seedProjects()
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
