'use client'

import { useContactFormStore } from '@/hooks/ui/contact-form'
import type { ReactNode } from 'react'

export default function ContactPopupTrigger({
  className,
  children,
  label,
}: {
  className?: string
  children?: ReactNode
  label?: string
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        e.preventDefault()
        useContactFormStore.getState().open()
      }}
      aria-label={label}
    >
      {children}
    </button>
  )
}
