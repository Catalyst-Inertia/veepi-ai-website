import type { Metadata, Viewport } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import '@/styles/global.scss'

import GlobalProvider from '@/components/container/global-provider'
import SmoothScroll from '@/components/container/smooth-scroll'
import MainContainer from '@/components/layout'
import { LivePreviewRefresh } from '@/components/live-preview/refresh-route'
import { SITE_NAME } from '@/utils/metadata-page-builder'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'Catatia official website',
}

// Without device-width, phones render the ~980px layout viewport scaled down:
// every max-width media query (block responsive styles, the RedDot size
// breakpoints) silently fails and section glows get cut at the screen edge.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/yfe3bem.css" />
      </head>
      <GoogleTagManager gtmId="GTM-WGM9DSKB" />
      <body suppressHydrationWarning>
        <LivePreviewRefresh />
        <SmoothScroll>
          <GlobalProvider>
            <MainContainer>{children}</MainContainer>
          </GlobalProvider>
        </SmoothScroll>
      </body>
    </html>
  )
}
