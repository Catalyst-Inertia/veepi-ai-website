'use client'

import Image from 'next/image'
import BoxContainer from '@/components/container/boxed'
import { PageNavigationData } from '@/data/page-navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useScrollDetection } from '@/hooks/ui/scroll-detection'

export default function ContainerPageHeaderDesktop() {
  const router = useRouter()
  const { withBackground, isLight, isVisible } = useScrollDetection()

  return (
    <>
      <AnimatePresence key={'header-animation'} mode="sync">
        <motion.header
          className={`fixed w-full top-0 z-50 transition-[background] ${withBackground ? 'bg-white drop-shadow-lg' : 'bg-transparent'} min-h-[80px] flex items-center`}
          initial={{ y: 0 }}
          animate={{ y: isVisible ? 0 : '-110%' }}
          transition={{ duration: 0.3 }}
        >
          <BoxContainer sectionClassName="w-full">
            <div className="relative flex w-full items-center justify-between min-h-[96px]">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  router.push('/')
                }}
              >
                <div className="w-[121px] h-[48px] relative">
                  <Image
                    src={isLight ? '/veepi-logo-black.svg' : '/veepi-logo.svg'}
                    fill
                    alt="logo"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-[41px]">
                <div
                  className={`hidden lg:flex items-center gap-[41px] font-text text-[12px] leading-none uppercase ${isLight ? 'text-black font-bold' : 'text-[#FBF2E9]'}`}
                >
                  {PageNavigationData.map((item) => (
                    <a
                      key={item.key}
                      href={item.url}
                      target={
                        item.url.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        item.url.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className={`cursor-pointer transition-colors ${isLight ? 'hover:text-black/70' : 'hover:text-white/80'}`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                <a
                  href="https://veepi.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-[6px] rounded-[10px] border px-[24px] py-[12px] text-[12px] font-text leading-[12px] uppercase transition-all hover:bg-[linear-gradient(to_right,var(--second_color),var(--primary_color))] hover:text-white hover:border-transparent ${isLight ? 'border-black text-black' : 'border-[#FBF2E9] text-[#FBF2E9]'}`}
                >
                  LOG IN
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16l4-4-4-4" />
                    <path d="M8 12h8" />
                  </svg>
                </a>
              </div>
            </div>
          </BoxContainer>
        </motion.header>
      </AnimatePresence>
    </>
  )
}
