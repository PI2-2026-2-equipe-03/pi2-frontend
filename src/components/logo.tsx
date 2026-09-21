import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
}

// wordmark tagravado — "g" em amarelo (marca)
export function Logo({ className }: LogoProps) {
  return (
    <span className={cn('font-bold tracking-tight', className)}>
      Ta<span className="text-tg-brand-yellow">G</span>ravado
    </span>
  )
}
