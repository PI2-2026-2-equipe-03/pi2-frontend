import type { ReactNode } from 'react'

import { Logo } from '@/components/logo'
import { useScrolled } from '@/lib/use-scrolled'
import { cn } from '@/lib/utils'

// icon buttons sit on the brand blue, so they need white text and a white hover
export const headerIconClasses =
  'rounded-full text-white transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-white/40'

type SiteHeaderProps = {
  logoTo: string
  // left of the logo: the menu trigger on the signed-in areas
  leading?: ReactNode
  // right side actions (theme, profile)
  children?: ReactNode
}

// brand header shared by every area, signed in or not, so the logo always has
// the same place and nothing floats over it
export function SiteHeader({ logoTo, leading, children }: SiteHeaderProps) {
  const scrolled = useScrolled(8)

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        'bg-tg-brand-blue z-sticky h-header pt-safe-top sticky top-0 flex shrink-0 items-center justify-between px-4 text-white transition-shadow duration-200 ease-out md:px-6',
        scrolled ? 'shadow-md' : 'shadow-sm',
        'motion-reduce:transition-none',
      )}
    >
      <div className="flex items-center gap-2">
        {leading}
        <Logo to={logoTo} className="text-xl md:text-2xl" />
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </header>
  )
}
