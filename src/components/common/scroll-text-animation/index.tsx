'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function ScrollTextAnimation() {
  const container = useRef(null)

  useGSAP(
    () => {
      const texts = gsap.utils.toArray('.scroll-text') as HTMLElement[]

      texts.forEach((text) => {
        gsap.fromTo(
          text,
          {
            opacity: 0.1,
          },
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: text,
              start: 'top center',
              end: 'bottom center',
              toggleActions: 'play reverse play reverse',
            },
          },
        )
      })
    },
    { scope: container },
  )

  return (
    <div
      ref={container}
      className="flex min-h-screen w-full flex-col items-center justify-center gap-[150px] py-[60px]"
    >
      <div className="scroll-text text-2xl font-bold text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>
      <div className="scroll-text text-2xl font-bold text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>
      <div className="scroll-text text-2xl font-bold text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>
    </div>
  )
}
