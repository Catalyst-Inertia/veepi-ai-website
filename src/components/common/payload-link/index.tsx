import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Reusable navigation primitive for CMS-driven links (spec item 7).
 *
 * Consumes the normalized `ResolvedLink` shape produced by the `link` /
 * `groupLink` schema afterRead hooks:
 * - internal links render as Next.js `<Link>` (crawlable, client-side nav)
 * - external links render as a plain `<a>` with safe new-tab flags
 *
 * No `'use client'`: the component is isomorphic, so it can be used from
 * both server components and client components (header/footer).
 */
export default function PayloadLink({
  link,
  className,
  onClick,
  children,
}: {
  /**
   * Normalized link from the CMS (see link.field.ts ResolvedLink). Stored
   * rows may carry `url` as optional before afterRead; callers guard with a
   * truthiness check before rendering, and this component no-ops on null.
   */
  link: {
    label: string
    type: 'internal' | 'external'
    url?: string | null
    newTab?: boolean | null
  }
  className?: string
  onClick?: () => void
  children?: ReactNode
}) {
  const url = link.url
  if (!url) return null

  const content = children ?? link.label

  if (link.type === 'internal') {
    return (
      <Link
        href={url}
        className={className}
        onClick={onClick}
        aria-label={link.label || undefined}
        target={link.newTab ? '_blank' : undefined}
        rel={link.newTab ? 'noopener noreferrer' : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <a
      href={url}
      className={className}
      onClick={onClick}
      aria-label={link.label || undefined}
      target={link.newTab ? '_blank' : undefined}
      rel={link.newTab ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  )
}
