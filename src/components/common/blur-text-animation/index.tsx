'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, SplitText)

export default function BlurTextAnimation({ text }: { text: string }) {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const split = new SplitText('.split-text', { type: 'chars' })
      gsap.from(split.chars, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 2,
      })
    },
    { scope: containerRef, dependencies: [text] },
  )

  return (
    <div ref={containerRef}>
      <h1 className="split-text">{text}</h1>
    </div>
  )
}
