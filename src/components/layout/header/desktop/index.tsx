'use client'

import Image from 'next/image'
import BoxContainer from '@/components/container/boxed'
import { PageNavigationData } from '@/data/page-navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useScrollDetection } from '@/hooks/ui/scroll-detection'

export default function ContainerPageHeaderDesktop() {
  const router = useRouter()

  const { withBackground } = useScrollDetection()

  return (
    <>
      <AnimatePresence key={'header-animation'} mode="sync">
        <motion.header
          className={`fixed w-full top-0 z-50 transition-[background] ${withBackground ? 'bg-black-color drop-shadow-lg' : 'bg-transparent'} min-h-[80px] flex items-center`}
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BoxContainer sectionClassName="w-full">
            <div className="flex flex-wrap justify-between items-center min-h-[113px]">
              <div
                className="w-[121px] h-[48px] relative cursor-pointer"
                onClick={() => {
                  router.push('/')
                }}
              >
                <Image
                  src={'/veepi-logo.svg'}
                  fill
                  alt="logo"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="flex flex-wrap gap-[41px] font-text text-[12px] leading-none uppercase text-[#FBF2E9]">
                {PageNavigationData.map((item) => (
                  <div
                    key={item.key}
                    onClick={() => {
                      router.push(`${item.url}`)
                    }}
                    className="cursor-pointer"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </BoxContainer>
        </motion.header>
      </AnimatePresence>
    </>
  )
}
