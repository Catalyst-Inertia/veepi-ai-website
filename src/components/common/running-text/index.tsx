'use client'

import s from './index.module.scss'
import { ServiceStarIcon } from '@/components/icons/service-star'
import { motion } from 'framer-motion'
import { Fragment, useEffect, useRef, useState } from 'react'
import { homepageRunningText } from '@/data/homepage'

export default function RunningText({
  items = homepageRunningText,
}: {
  items?: readonly string[]
}) {
  const itemRef = useRef<HTMLDivElement>(null)
  const [itemWidth, setItemWidth] = useState(0)

  const textItems = (
    <div
      className="flex flex-none gap-7 items-center justify-center"
      ref={itemRef}
    >
      {items.map((item, index) => (
        <Fragment key={index}>
          <h3 className={`w-fit ${index === 0 ? 'ml-7' : ''}`}>{item}</h3>
          <div>
            <ServiceStarIcon />
          </div>
        </Fragment>
      ))}
    </div>
  )

  useEffect(() => {
    if (itemRef.current) {
      setItemWidth(itemRef.current.clientWidth)
    }
  }, [])

  return (
    <div className={`${s.container} overflow-hidden whitespace-nowrap`}>
      <motion.div
        className={`${s.running_text} flex whitespace-nowrap`}
        initial={{ translateX: '0%' }}
        animate={{ translateX: `-${itemWidth}px` }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {textItems}
        {textItems}
      </motion.div>
    </div>
  )
}
