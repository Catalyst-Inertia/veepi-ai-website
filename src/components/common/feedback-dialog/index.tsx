'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useFeedbackDialog } from '@/hooks/ui/feedback-dialog'
import { useLenis } from 'lenis/react'

export function FeedbackDialog() {
  const { isOpen, close, type, message, description } = useFeedbackDialog()
  const [mounted, setMounted] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close()
      }
      window.addEventListener('keydown', handleEsc)
      return () => {
        lenis?.start()
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleEsc)
      }
    }
  }, [isOpen, lenis, close])

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
            className="relative w-full max-w-[500px] bg-[#F6EFE9]/90 backdrop-blur-xl rounded-[24px] p-8 md:p-12 flex flex-col gap-8 text-center"
          >
            {/* Background Blob Container */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-[24px] pointer-events-none">
              <div
                className="absolute w-[352px] h-[349px] rounded-full"
                style={{
                  left: 'calc(50% - 176px)',
                  top: 'calc(50% - 174px)',
                  background:
                    type === 'success'
                      ? 'linear-gradient(180deg, rgba(240,135,107,0.8), rgba(192,94,196,0.8))'
                      : 'linear-gradient(180deg, rgba(240,107,107,0.8), rgba(196,94,94,0.8))',
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

            <div className="relative z-10 flex flex-col items-center gap-4">
              {type === 'success' ? (
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[linear-gradient(225deg,#F0876B,#C05EC4)] border-[1.2px] border-white/15">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FBF2E9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 border-[1.2px] border-white/15">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FBF2E9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              )}
              <h3 className="font-title text-[32px] md:text-[40px] leading-tight text-[#372B34] mt-2">
                {message}
              </h3>
              <p className="font-text text-[16px] leading-[24px] text-[#6E6155]">
                {description}
              </p>

              <button
                type="button"
                onClick={close}
                className="mt-6 h-[48px] px-8 rounded-lg bg-[linear-gradient(90deg,#C05EC4_0%,#F0876B_100%)] uppercase font-text font-bold text-[12px] text-[#FBF2E9] tracking-wider transition-transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
