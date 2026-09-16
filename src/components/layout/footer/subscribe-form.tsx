'use client'

import { useState } from 'react'

export default function SubscribeForm({
  placeholder,
  buttonLabel,
  note,
}: {
  placeholder: string
  buttonLabel: string
  note: string
}) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    setSending(true)
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission: { email },
          metadata: {
            formType: 'newsletter',
            originPath: window.location.pathname,
          },
        }),
      }).then((res) => {
        if (!res.ok) throw new Error(String(res.status))
      })
      setEmail('')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('subscribe failed:', err)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} className="flex gap-2 items-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label={placeholder}
          placeholder={placeholder}
          className="w-[298px] h-12 grow bg-[#F5F5F5] border border-[#787878] rounded-lg px-4 text-[16px] text-[#372B34] placeholder:text-[#787878]/50 outline-none"
        />
        <button
          type="submit"
          disabled={sending}
          className="h-12 px-6 rounded-lg bg-[linear-gradient(90deg,#C05EC4_0%,#F0876B_100%)] text-[12px] leading-none uppercase text-[#FBF2E9] disabled:opacity-50"
        >
          {buttonLabel}
        </button>
      </form>
      {note && (
        <div className="italic text-[12px] leading-[18px] text-[#FBF2E9]/50">
          {note}
        </div>
      )}
    </div>
  )
}
