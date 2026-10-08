import type { Metadata, Viewport } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import '@/styles/global.scss'

import GlobalProvider from '@/components/container/global-provider'
import SmoothScroll from '@/components/container/smooth-scroll'
import MainContainer from '@/components/layout'
import { LivePreviewRefresh } from '@/components/live-preview/refresh-route'

export const metadata: Metadata = {
  title: 'VeePi - AI Video Platform for Medical & Aesthetic Practices',
  description:
    'Transform your patient results and treatment imagery into high-performing video content for Reels, TikTok, YouTube, and Stories. Built for aesthetic & medical professionals.',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/icon.png' }],
  },
  openGraph: {
    images: [{ url: '/og-image.png' }],
  },
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
        <link rel="icon" href="/icon.png" type="image/png" />
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
