import SplashScreen from '@/components/common/splash-screen'
import Footer from './footer'
import { ContactFormPopup } from '@/components/common/contact-form-popup'
import { FeedbackDialog } from '@/components/common/feedback-dialog'
import Header from './header'

export default function MainContainer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <ContactFormPopup />
      <FeedbackDialog />
      <SplashScreen />
      <main className="min-h-[25vh]">{children}</main>
      <Footer />
    </>
  )
}
