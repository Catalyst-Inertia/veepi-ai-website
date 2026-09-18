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

  const sizeClass = size
    ? size === 'small'
      ? s.small
      : s.default
    : isMobile
      ? s.small
      : s.default

  const typeClass =
    type === 'primary'
      ? s.primary
      : type === 'secondary'
        ? s.secondary
        : s.outlined

  const buttonClassName = `${s.button} ${sizeClass} ${typeClass} ${className}`

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
