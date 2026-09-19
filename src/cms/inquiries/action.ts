'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ALLOWED_CONTENT_TYPES, type ContactContentType } from './options'

export type SubmitContactInquiryInput = {
  fullName: string
  workEmail: string
  practice: string
  role: string
  contentTypes: string[]
  originPath: string
}

export type SubmitContactInquiryResult =
  | { ok: true }
  | { ok: false; error: string }

export async function submitContactInquiry(
  input: SubmitContactInquiryInput,
): Promise<SubmitContactInquiryResult> {
  const fullName = input.fullName?.trim() ?? ''
  const workEmail = input.workEmail?.trim() ?? ''
  const practice = input.practice?.trim() ?? ''
  const role = input.role?.trim() ?? ''
  const contentTypes = Array.isArray(input.contentTypes)
    ? input.contentTypes
        .filter((v, i, a) => a.indexOf(v) === i)
        .filter(
          (t): t is ContactContentType => ALLOWED_CONTENT_TYPES[t] === true,
        )
    : []

  if (!fullName || !practice || !role || !contentTypes.length) {
    return {
      ok: false,
      error: 'Please fill in all fields and choose at least one option.',
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const payload = await getPayload({ config })
  const hdrs = await headers()

  await payload.create({
    collection: 'inquiries',
    data: {
      submission: { fullName, workEmail, practice, role, contentTypes },
      metadata: {
        formType: 'contact-popup',
        originPath: input.originPath,
        userAgent: hdrs.get('user-agent') ?? undefined,
        ip: hdrs.get('x-forwarded-for') ?? undefined,
        submittedAt: new Date().toISOString(),
      },
    },
  })

  return { ok: true }
}
