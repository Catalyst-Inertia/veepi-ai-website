'use client'

import { useRouter } from 'next/navigation'
import s from './index.module.scss'
import PayloadLink from '@/components/common/payload-link'
import useScreenSize from '@/hooks/ui/screen-size'

export default function MainButton({
  children,
  onClick = () => {},
  type = 'primary',
  className,
  link,
  href,
  newTab = false,
  linkType = 'external',
  size,
}: {
  children: React.ReactNode
  onClick?: (id: string) => void
  type?: 'primary' | 'secondary' | 'outlined'
  className?: string
  link?: string
  href?: string
  newTab?: boolean
  /** Navigation kind for the anchor fallback — CMS callers pass `cta.type`. */
  linkType?: 'internal' | 'external'
  size?: 'default' | 'small'
}) {
  const router = useRouter()
  const { isMobile } = useScreenSize()

  const baseClasses =
    'w-fit flex justify-center items-center uppercase cursor-pointer font-text font-bold tracking-[0.025em] transition-all duration-200'

  const sizeClass = size
    ? size === 'small'
      ? 'min-h-[40px] px-4 py-2 rounded-md'
      : 'min-h-[56px] px-6 py-4 rounded-lg'
    : isMobile
      ? 'min-h-[40px] px-4 py-2 rounded-md'
      : 'min-h-[56px] px-6 py-4 rounded-lg'

  const typeClass =
    type === 'primary'
      ? 'bg-primary text-white border-2 border-primary hover:bg-[linear-gradient(to_right,var(--second_color),var(--primary_color))] hover:border-transparent hover:shadow-none'
      : type === 'secondary'
        ? 'bg-white text-primary hover:bg-primary hover:text-white'
        : 'bg-transparent text-primary border border-primary'

  const buttonClassName = `${baseClasses} ${sizeClass} ${typeClass} ${s.button} ${className ?? ''}`

  if (href) {
    return (
      <PayloadLink
        link={{ label: '', type: linkType, url: href, newTab }}
        className={buttonClassName}
        onClick={() => onClick('something')}
      >
        {children}
      </PayloadLink>
    )
  }

  return (
    <button
      className={buttonClassName}
      onClick={() => {
        onClick('something')
        if (link) router.push(link)
      }}
    >
      {children}
    </button>
  )
}
