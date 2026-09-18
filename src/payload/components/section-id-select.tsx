'use client'

import { useEffect, useRef, useState } from 'react'
import { Select } from 'antd'
import type { TextFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'

import './section-id-select.css'
type InternalTarget = { relationTo: 'pages' | 'posts'; id: string }
type BlockOption = { label: string; value: string }

/**
 * Reads the sibling `internalUrl` relationship value from the form state.
 * The link row is the parent of this field, so the sibling path is the
 * field path minus its last segment plus `.internalUrl`.
 */
const getInternalUrlPath = (path: string): string => {
  const dot = path.lastIndexOf('.')
  return dot === -1 ? 'internalUrl' : `${path.slice(0, dot)}.internalUrl`
}

const getInternalTarget = (value: unknown): InternalTarget | null => {
  // `value` is the resolved field value at `nav.N.internalUrl` — a
  // relationship object `{ relationTo, value }` (or populated doc/object).
  // No `.internalUrl` wrapper; this path IS the internalUrl field.
  if (value === null || typeof value !== 'object') return null
  const relationTo = (value as { relationTo?: unknown }).relationTo
  if (relationTo !== 'pages' && relationTo !== 'posts') return null
  const raw = (value as { value?: unknown }).value
  const id =
    typeof raw === 'string'
      ? raw
      : raw !== null && typeof raw === 'object'
        ? (raw as { id?: unknown }).id
        : undefined
  return typeof id === 'string' && id.length > 0 ? { relationTo, id } : null
}

const toOptions = (contents: unknown): BlockOption[] => {
  if (!Array.isArray(contents)) return []
  const seen = new Set<string>()
  const options: BlockOption[] = []
  for (const block of contents) {
    if (block === null || typeof block !== 'object') continue
    const { blockType, sectionId } = block as {
      blockType?: unknown
      sectionId?: unknown
    }
    if (typeof sectionId !== 'string' || sectionId.length === 0) continue
    if (seen.has(sectionId)) continue
    seen.add(sectionId)
    options.push({
      label:
        typeof blockType === 'string' && blockType.length > 0
          ? `${blockType} — ${sectionId}`
          : sectionId,
      value: sectionId,
    })
  }
  return options
}

export const SectionIdSelect: TextFieldClientComponent = ({
  path,
  readOnly,
}: {
  path?: string
  readOnly?: boolean
}) => {
  const { value, setValue } = useField<string>({ path })
  const internalUrl = useField<unknown>({
    path: getInternalUrlPath(path || ''),
  })
  const [options, setOptions] = useState<BlockOption[]>([])
  const [loading, setLoading] = useState(false)
  const loadedTargetRef = useRef('')

  const target = getInternalTarget(internalUrl.value)
  const targetKey = target ? `${target.relationTo}:${target.id}` : ''

  useEffect(() => {
    if (targetKey === loadedTargetRef.current) return
    loadedTargetRef.current = targetKey
    setOptions([])
    if (!target) return

    // AbortController guards against racing responses when the target
    // changes mid-fetch. The ref is reset in cleanup so React Strict Mode's
    // setup -> cleanup -> setup replay refetches instead of swallowing the
    // first (cancelled) response and leaving the dropdown permanently empty.
    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/${target.relationTo}/${target.id}?depth=0`, {
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (controller.signal.aborted) return
        setOptions(toOptions(doc?.contents))
        setLoading(false)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setOptions([])
        setLoading(false)
      })
    return () => {
      controller.abort()
      loadedTargetRef.current = ''
    }
  }, [targetKey])

  return (
    <Select
      allowClear
      showSearch
      optionFilterProp="label"
      placeholder={
        target ? 'Select a section…' : 'Pick an internal target first'
      }
      disabled={!target || readOnly}
      loading={loading}
      options={options}
      value={value ?? undefined}
      onChange={(next) => setValue(next ?? null)}
      className="section-id-select"
      popupClassName="section-id-dropdown"
      getPopupContainer={() =>
        document.querySelector('.template-default__wrap') || document.body
      }
      style={{ width: '100%' }}
    />
  )
}
