'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLenis } from 'lenis/react'
import Image from 'next/image'
import { useContactForm } from '@/hooks/ui/contact-form'
import { submitContactInquiry } from '@/cms/inquiries/action'
import { notification } from 'antd'
import {
  CONTACT_CONTENT_TYPE_OPTIONS,
  type ContactContentType,
} from '@/cms/inquiries/options'
import { useMainNotification } from '@/hooks/ui/notification'

function FieldRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-text font-[800] text-[10px] leading-[10px] uppercase text-[#1F1F1F]">
        {label}
      </span>
      {children}
    </label>
  )
}

function MultiSelect({
  value,
  onChange,
}: {
  value: ContactContentType[]
  onChange: (val: ContactContentType[]) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const toggle = (optValue: ContactContentType) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue))
    } else {
      onChange([...value, optValue])
    }
  }

  const selectedLabels = value
    .map((v) => CONTACT_CONTENT_TYPE_OPTIONS.find((o) => o.value === v)?.label)
    .filter(Boolean)
    .join(', ')

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full h-[48px] rounded-lg border border-[#787878] bg-[#F5F5F5] px-4 items-center justify-between font-text text-[16px] text-left"
      >
        <span
          className={
            value.length > 0 ? 'text-[#372B34] truncate' : 'text-[#787878]/50'
          }
        >
          {value.length > 0 ? selectedLabels : 'Choose one or more'}
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#777777"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
          className="shrink-0"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+8px)] left-0 w-[264px] bg-white border border-[#777777] rounded-lg py-2 px-4 flex flex-col gap-2 z-20 shadow-lg"
          >
            {CONTACT_CONTENT_TYPE_OPTIONS.map((opt) => {
              const isChecked = value.includes(opt.value)
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className="flex items-center gap-3 text-left py-1"
                >
                  <div
                    className="w-6 h-6 shrink-0 rounded border border-[#777777] flex items-center justify-center transition-colors"
                    style={{
                      background: isChecked
                        ? 'linear-gradient(90deg, #C05EC4, #F0876B)'
                        : 'transparent',
                      borderColor: isChecked ? 'transparent' : '#777777',
                    }}
                  >
                    {isChecked && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <span className="font-text text-[16px] text-[#372B34]">
                    {opt.label}
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ContactFormPopup() {
  const { isOpen, close } = useContactForm()
  const [mounted, setMounted] = useState(false)
  const lenis = useLenis()
  const showNotification = useMainNotification()

  const [fullName, setFullName] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [practice, setPractice] = useState('')
  const [role, setRole] = useState('')
  const [contentTypes, setContentTypes] = useState<ContactContentType[]>([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [isOpen, lenis])

  // Only close on Escape if the multiselect isn't open (it handles its own Escape)
  // We'll just rely on a global listener
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, close])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (contentTypes.length === 0) {
      notification.error({
        message: 'Error',
        description: 'Please choose at least one option.',
      })
      return
    }
    setSending(true)
    try {
      const result = await submitContactInquiry({
        fullName,
        workEmail,
        practice,
        role,
        contentTypes,
        originPath: window.location.pathname,
      })

      if (result.ok) {
        showNotification({
          type: 'success',
          entity: 'enquiry',
          action: 'submitted',
        })
        close()
        // Reset form
        setTimeout(() => {
          setFullName('')
          setWorkEmail('')
          setPractice('')
          setRole('')
          setContentTypes([])
        }, 300) // wait for animation
      } else {
        notification.error({ message: 'Error', description: result.error })
      }
    } catch {
      notification.error({
        message: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setSending(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#F6EFE9]/40 backdrop-blur-md"
            onClick={close}
          />
          <motion.div
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '100vh' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-[720px] bg-[#F6EFE9]/90 backdrop-blur-xl rounded-[24px] p-12 flex flex-col md:flex-row gap-16 md:gap-[64px]"
          >
            {/* Background Blob Container (Clips Blob to rounded borders) */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-[24px] pointer-events-none">
              <div
                className="absolute w-[352px] h-[349px] rounded-full"
                style={{
                  left: 'calc(50% + 117.6px - 176px)',
                  top: 'calc(50% - 73.44px - 174px)',
                  background:
                    'linear-gradient(180deg, rgba(240,135,107,0.8), rgba(192,94,196,0.8))',
                  filter: 'blur(100px)',
                  transform: 'rotate(-46.37deg)',
                }}
              />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={close}
              className="absolute top-[20px] right-[20px] z-20 w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M24 8L8 24M8 8L24 24"
                  stroke="#372B34"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Left Column */}
            <div className="relative z-10 w-full md:w-[280px] flex flex-col gap-[32px] shrink-0">
              {/* Highlight Tag */}
              <div className="relative self-start">
                <div
                  className="absolute top-0 h-px w-[62%]"
                  style={{
                    left: '19.3%',
                    background:
                      'linear-gradient(90deg, rgba(192,94,196,0) 0%, #C05EC4 50%, rgba(192,94,196,0) 100%)',
                  }}
                />
                <div
                  className="rounded-[40px] px-8 py-2 flex items-center gap-[6px]"
                  style={{
                    background:
                      'linear-gradient(0.56deg, rgba(192,94,196,0.1), rgba(240,135,107,0.1))',
                  }}
                >
                  <div
                    className="w-[24px] h-[24px] rounded-[18px] flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(225deg, #F0876B, #C05EC4)',
                      border: '1.2px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 2V12M2 7H12"
                        stroke="#FBF2E9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="font-text font-[800] text-[10px] leading-[10px] tracking-[8px] uppercase text-[#372B34] ml-1">
                    GET STARTED
                  </span>
                </div>
              </div>

              <h3 className="font-title text-[48px] leading-[48px] text-[#372B34]">
                Let&apos;s create something worth watching.
              </h3>

              <p className="font-text text-[16px] leading-[24px] text-[#6E6155]">
                Tell us a little about your practice and what you want to
                create. Our team will help you find the right VeePi setup for
                your content needs.
              </p>

              <div className="mt-auto pt-4 hidden md:block">
                <Image
                  src="/veepi-logo-black.svg"
                  width={121}
                  height={48}
                  alt="VeePi"
                  className="opacity-90"
                />
              </div>
            </div>

            {/* Right Column (Form) */}
            <form
              onSubmit={handleSubmit}
              className="relative z-10 w-full md:w-[280px] flex flex-col gap-[16px] shrink-0"
            >
              <FieldRow label="FULL NAME">
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-[48px] rounded-lg border border-[#787878] bg-[#F5F5F5] px-4 font-text text-[16px] text-[#372B34] placeholder:text-[#787878]/50"
                />
              </FieldRow>
              <FieldRow label="WORK EMAIL">
                <input
                  type="email"
                  required
                  placeholder="e.g. youremail@email.com"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full h-[48px] rounded-lg border border-[#787878] bg-[#F5F5F5] px-4 font-text text-[16px] text-[#372B34] placeholder:text-[#787878]/50"
                />
              </FieldRow>
              <FieldRow label="PRACTICE/COMPANY">
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Clinic"
                  value={practice}
                  onChange={(e) => setPractice(e.target.value)}
                  className="w-full h-[48px] rounded-lg border border-[#787878] bg-[#F5F5F5] px-4 font-text text-[16px] text-[#372B34] placeholder:text-[#787878]/50"
                />
              </FieldRow>
              <FieldRow label="YOUR ROLE">
                <input
                  type="text"
                  required
                  placeholder="e.g. plastic surgeon"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-[48px] rounded-lg border border-[#787878] bg-[#F5F5F5] px-4 font-text text-[16px] text-[#372B34] placeholder:text-[#787878]/50"
                />
              </FieldRow>

              <div className="mb-2">
                <FieldRow label="WHAT ARE YOU CREATING?">
                  <MultiSelect
                    value={contentTypes}
                    onChange={setContentTypes}
                  />
                </FieldRow>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full h-[48px] rounded-lg px-6 uppercase flex items-center justify-center mt-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  background:
                    'linear-gradient(90deg, #C05EC4 0%, #F0876B 100%)',
                }}
              >
                <span className="font-text text-[12px] text-[#FBF2E9] tracking-wider font-bold">
                  {sending ? 'SENDING...' : 'GET STARTED'}
                </span>
              </button>

              <p className="font-text italic text-[12px] text-[#6E6155] text-center mt-1">
                We&apos;ll be in touch shortly.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
