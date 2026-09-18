import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const useScrollDetection = () => {
  const { scrollY } = useScroll()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [withBackground, setWithBackground] = useState(false)
  const [isLight, setIsLight] = useState(false)

  const checkTheme = () => {
    // Check if there is a hero block on the page
    const hero = document.querySelector('[data-is-hero="true"]')
    if (!hero) {
      setIsLight(true)
    } else {
      const rect = hero.getBoundingClientRect()
      // If the bottom of the hero block is at or above the header height
      if (rect.bottom <= 80) {
        setIsLight(true)
      } else {
        setIsLight(false)
      }
    }
  }

  // Run on mount and whenever the route changes
  useEffect(() => {
    // Wait a tick for the DOM to update after navigation
    const timeoutId = setTimeout(checkTheme, 50)
    return () => clearTimeout(timeoutId)
  }, [pathname])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setLastScrollY(latest)

    if (latest > lastScrollY) {
      setIsVisible(false)
    }

    if (latest < lastScrollY) {
      setIsVisible(true)
    }

    if (latest !== 0 && isVisible) {
      setWithBackground(true)
    } else {
      setWithBackground(false)
    }

    checkTheme()
  })

  return {
    withBackground,
    isVisible,
    isLight,
  }
}
