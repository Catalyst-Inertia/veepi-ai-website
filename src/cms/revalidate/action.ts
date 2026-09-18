'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  revalidateAll as revalidateAllCore,
  revalidateSingle as revalidateSingleCore,
  type RevalidateSingleTarget,
} from './core'

const assertPayloadAdmin = async (): Promise<void> => {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) {
    throw new Error(
      'Unauthorized: revalidation requires a logged-in Payload admin',
    )
  }
}

export async function revalidateSingle(
  target: RevalidateSingleTarget,
): Promise<{
  revalidated: true
}> {
  await assertPayloadAdmin()
  await revalidateSingleCore(target)
  return { revalidated: true }
}

export async function revalidateAll(): Promise<{ revalidated: true }> {
  await assertPayloadAdmin()
  await revalidateAllCore()
  return { revalidated: true }
}
