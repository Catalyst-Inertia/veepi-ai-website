'use client'

import { RefreshRouteOnSave as PayloadRefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

import { SERVER_URL } from '@/cms/origin'

// Server-side live preview (documented Payload pattern): the admin live-preview
// iframe loads /preview?... which enables draft mode, then this component
// refreshes the route on every doc event (autosave, save, publish).
export const LivePreviewRefresh: React.FC = () => {
  const router = useRouter()
  return (
    <PayloadRefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={SERVER_URL}
    />
  )
}
