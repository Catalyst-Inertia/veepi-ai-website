import BoxContainer from '@/components/container/boxed'
import { BurgerMenuIcon } from '@/components/icon/burger-menu'
import { PageNavigationData } from '@/data/page-navigation'
import { useScrollDetection } from '@/hooks/ui/scroll-detection'
import { CloseCircleOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import s from './index.module.scss'

export default function ContainerPageHeaderMobile() {
  const router = useRouter()

  const [openMenu, setOpenMenu] = useState(false)

  const { withBackground, isLight, isVisible } = useScrollDetection()

  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [openMenu])

  return (
    <>
      <AnimatePresence key={'header-animation'} mode="sync">
        <motion.header
          className={`fixed w-full top-0 z-50 transition-[background] ${withBackground ? 'bg-white drop-shadow-lg' : 'bg-transparent'} min-h-[80px] flex items-center`}
          initial={{ y: 0 }}
          animate={{ y: openMenu || isVisible ? 0 : '-110%' }}
          transition={{ duration: 0.3, bounce: false }}
        >
          <BoxContainer sectionClassName="w-full">
            <div className="flex flex-wrap justify-between items-center min-h-[85px]">
              <div
                className="w-[121px] h-[48px] relative cursor-pointer"
                onClick={() => {
                  router.push('/')
                  setOpenMenu(false)
                }}
              >
                <Image
                  src={isLight ? '/veepi-logo-black.svg' : '/veepi-logo.svg'}
                  fill
                  alt="logo"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className={`flex items-center gap-[6px] rounded-[10px] border px-[16px] py-[8px] text-[12px] font-text leading-[12px] uppercase transition-all hover:bg-[linear-gradient(to_right,var(--second_color),var(--primary_color))] hover:text-white hover:border-transparent ${isLight ? 'border-black text-black' : 'border-[#FBF2E9] text-[#FBF2E9]'}`}
                  onClick={() => router.push('/login')}
                >
                  LOG IN
                  <svg
                    width="14"
                    height="14"
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
                </button>
                <div
                  className={`flex flex-wrap cursor-pointer ${isLight ? 'text-black' : 'text-[#FDFDFD]'}`}
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <BurgerMenuIcon className={s.icon} />
                </div>
              </div>
            </div>
          </BoxContainer>
        </motion.header>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {openMenu && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/60"
            onClick={() => setOpenMenu(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, bounce: false }}
              className="w-[85vw] max-w-[400px] h-screen right-0 relative z-10 flex flex-col justify-between px-[25px] bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full z-10 flex flex-col min-h-full">
                <div className="w-full flex-grow">
                  <div className="min-h-[80px] flex items-center justify-between mb-8 w-full">
                    <div
                      className="w-[121px] h-[48px] relative cursor-pointer"
                      onClick={() => {
                        router.push('/')
                        setOpenMenu(false)
                      }}
                    >
                      <Image
                        src={'/veepi-logo-black.svg'}
                        fill
                        alt="logo"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="flex items-center gap-[6px] rounded-[10px] border px-[16px] py-[8px] text-[12px] font-text leading-[12px] uppercase transition-all hover:bg-[linear-gradient(to_right,var(--second_color),var(--primary_color))] hover:text-white hover:border-transparent border-black text-black"
                        onClick={() => {
                          router.push('/login')
                          setOpenMenu(false)
                        }}
                      >
                        LOG IN
                        <svg
                          width="14"
                          height="14"
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
                      </button>
                      <div
                        onClick={() => setOpenMenu(false)}
                        className="text-[28px] text-black cursor-pointer"
                      >
                        <CloseCircleOutlined />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    {PageNavigationData.map((item) => {
                      return (
                        <div
                          key={item.key}
                          onClick={() => {
                            router.push(item.url, { scroll: true })
                            setOpenMenu(false)
                          }}
                          className={`text-[24px] font-bold mb-6 relative w-fit pb-1 text-black`}
                        >
                          {item.label}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="w-full mt-10 pb-10">
                  <div className="flex flex-wrap justify-between pt-[180px]">
                    <div className="w-full mb-6">
                      <div className="text-[18px] text-black">
                        © 2026 VeePi. All rights reserved.
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-8">
                      {/* Social links removed; to be driven by CMS globally */}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
