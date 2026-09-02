import type { Metadata } from 'next'
import { Chakra_Petch, Orbitron } from 'next/font/google'
import '@/styles/global.scss'

import MainContainer from '@/components/layout'

const chakra = Chakra_Petch({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font_text',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font_title',
})

export const metadata: Metadata = {
  title: 'Catalyst Inertia',
  description: 'Template Frontpage NextJS',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${chakra.variable}`}
        suppressHydrationWarning
      >
        <MainContainer>{children}</MainContainer>
      </body>
    </html>
  )
}
