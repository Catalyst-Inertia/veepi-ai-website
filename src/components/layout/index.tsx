import SplashScreen from '@/components/common/splash-screen'
import Footer from './footer'
import Header from './header'

export default function MainContainer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <SplashScreen />
      <main className="min-h-[25vh]">{children}</main>
      <Footer />
    </>
  )
}
