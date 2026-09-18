import Link from 'next/link'
import BoxContainer from '@/components/container/boxed'

export default function NotFound() {
  return (
    <BoxContainer sectionClassName="bg-transparent">
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <h1 className="heading-2">Page not found</h1>
        <p>Sorry, that page does not exist.</p>
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-[2px] text-white underline underline-offset-4"
        >
          Back to home
        </Link>
      </div>
    </BoxContainer>
  )
}
