import type { Metadata, Viewport } from 'next'
import { Chakra_Petch, Orbitron } from 'next/font/google'
import { GoogleTagManager } from '@next/third-parties/google'
import '@/styles/global.scss'

import GlobalProvider from '@/components/container/global-provider'
import MainContainer from '@/components/layout'
import { LivePreviewRefresh } from '@/components/live-preview/refresh-route'
import { SITE_NAME } from '@/utils/metadata-page-builder'

const chakra = Chakra_Petch({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font_text',
})
const orbitron = Orbitron({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font_title',
})

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
      <GoogleTagManager gtmId="GTM-WGM9DSKB" />
      <body
        className={`${orbitron.variable} ${chakra.variable}`}
        suppressHydrationWarning
      >
        <LivePreviewRefresh />
        <GlobalProvider>
          <MainContainer>{children}</MainContainer>
        </GlobalProvider>
      </body>
    </html>
  )
}
