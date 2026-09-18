import { cn } from '@/utils/cn'
import s from './index.module.scss'

export default function RedDot({
  containerClass: className,
  dotClass,
}: {
  containerClass?: string
  dotClass?: string
}) {
  return (
    <div className={cn(`opacity-60 z-[-0]`, className)}>
      <div className={`${s.dot} ${dotClass}`}></div>
    </div>
  )
}
