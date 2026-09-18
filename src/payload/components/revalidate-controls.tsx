'use client'

import { useState } from 'react'
import { toast } from '@payloadcms/ui'
import { revalidateAll, revalidateSingle } from '@/cms/revalidate/action'

type Collection = 'pages' | 'posts'

const inputClass =
  'w-full px-2 py-1 rounded border border-solid border-[var(--theme-elevation-150)] ' +
  'bg-[var(--theme-elevation-0)] text-[var(--theme-text)]'

export const RevalidateControls: React.FC = () => {
  const [collection, setCollection] = useState<Collection>('pages')
  const [slug, setSlug] = useState('')
  const [prefix, setPrefix] = useState('')
  const [isRevalidating, setIsRevalidating] = useState(false)

  const canRevalidateSingle = slug.trim().length > 0

  const handleRevalidateSingle = async (): Promise<void> => {
    if (!canRevalidateSingle) return
    setIsRevalidating(true)
    try {
      await revalidateSingle({
        collection,
        slug: slug.trim(),
        prefix: collection === 'posts' ? prefix.trim() : undefined,
      })
      toast.success('Cache revalidated')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Revalidation failed'
      toast.error(message)
    } finally {
      setIsRevalidating(false)
    }
  }

  const handleRevalidateAll = async (): Promise<void> => {
    if (
      !window.confirm(
        'Revalidate ALL pages? This will clear the entire cache and update the last revalidation timestamp.',
      )
    ) {
      return
    }
    setIsRevalidating(true)
    try {
      await revalidateAll()
      toast.success('All cache revalidated')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Revalidation failed'
      toast.error(message)
    } finally {
      setIsRevalidating(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1">
        Collection
        <select
          value={collection}
          onChange={(e) => setCollection(e.target.value as Collection)}
          className={inputClass}
        >
          <option value="pages">Pages</option>
          <option value="posts">Posts</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        Slug
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder={
            collection === 'pages'
              ? 'e.g. about (or use / for the flagged homepage)'
              : 'e.g. artchive-id'
          }
          className={inputClass}
        />
      </label>
      {collection === 'posts' && (
        <label className="flex flex-col gap-1">
          Group Prefix
          <input
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="e.g. /projects"
            className={inputClass}
          />
        </label>
      )}
      <button
        type="button"
        onClick={handleRevalidateSingle}
        disabled={!canRevalidateSingle || isRevalidating}
        className="px-3 py-1.5 rounded bg-[var(--theme-elevation-100)] text-[var(--theme-text)] disabled:opacity-50"
      >
        Revalidate This Page
      </button>
      <button
        type="button"
        onClick={handleRevalidateAll}
        disabled={isRevalidating}
        className="px-3 py-1.5 rounded bg-[var(--theme-elevation-100)] text-[var(--theme-text)] disabled:opacity-50"
      >
        Revalidate ALL Pages
      </button>
    </div>
  )
}
