import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const useScrollDetection = () => {
  const { scrollY } = useScroll()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [withBackground, setWithBackground] = useState(false)
  const [isLight, setIsLight] = useState(false)

  // Run on mount and whenever the route changes
  useEffect(() => {
    // Wait a tick for the DOM to update after navigation
    const timeoutId = setTimeout(checkTheme, 50)
    return () => clearTimeout(timeoutId)
  }, [pathname])

  const checkTheme = (latest?: number) => {
    const currentScroll = latest ?? scrollY.get()
    const hero = document.querySelector('[data-is-hero="true"]')

    if (!hero) {
      setIsLight(true)
      setWithBackground(currentScroll > 0)
    } else {
      const rect = hero.getBoundingClientRect()
      if (rect.bottom <= 80) {
        setIsLight(true)
        setWithBackground(true)
      } else {
        setIsLight(false)
        setWithBackground(false)
      }
    }
  }

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0

    setIsVisible(latest < prev || latest <= 0)

    checkTheme(latest)
  })

  return {
    withBackground,
    isVisible,
    isLight: withBackground || isLight,
  }
}
