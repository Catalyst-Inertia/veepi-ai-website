'use client'
import { PopupList, useListQuery } from '@payloadcms/ui'
import type { Where } from 'payload'

const CATEGORIES = [
  { label: 'All Forms', value: undefined },
  { label: 'Contact Form', value: 'contact-popup' },
  { label: 'Newsletter', value: 'newsletter' },
]

export const FormTypeFilter: React.FC = () => {
  const { handleWhereChange, query } = useListQuery()
  const active = (
    query?.where as Record<string, { equals?: string }> | undefined
  )?.['metadata.formType']?.equals
  return (
    <>
      {CATEGORIES.map((c) => (
        <PopupList.Button
          key={c.label}
          active={c.value === active}
          onClick={() => {
            if (handleWhereChange) {
              void handleWhereChange(
                c.value === undefined
                  ? (undefined as unknown as Where) // SAFETY: Payload accepts undefined at runtime to clear the filter
                  : ({ 'metadata.formType': { equals: c.value } } as Where),
              )
            }
          }}
        >
          {c.label}
        </PopupList.Button>
      ))}
    </>
  )
}
