import { useState } from 'react'
import { useEffect } from 'react'

export default function useScreenSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number
    height: number
  }>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width > 0 && windowSize.width < 1024,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
  }
}
