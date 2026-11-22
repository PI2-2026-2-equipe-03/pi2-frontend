import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

// padding(0.75rem * 2) + the 48px primary action + top border + the device safe
// area. pages reserve exactly this much below their content, otherwise the last
// field ends up behind the fixed bar (same contract as bottomNavInset)
export const stickyActionBarInset =
  'pb-[calc(4.5rem+1px+var(--tg-safe-area-bottom))]'

type StickyActionBarProps = {
  children: ReactNode
  className?: string
}

// portaled to <body>: the route transition animates a transform on an
// ancestor, and a transformed ancestor turns `fixed` into "fixed to that box"
export function StickyActionBar({ children, className }: StickyActionBarProps) {
  return createPortal(
    <div
      // z-sticky (50) sits below overlays and modals on purpose: a dialog
      // covers the bar instead of negotiating with it. lg:left-56 leaves the
      // app sidebar (w-56) alone, it is the one thing that outranks the bar
      className={cn(
        'bg-background/95 border-border z-sticky pb-safe-bottom fixed inset-x-0 bottom-0 border-t backdrop-blur-md lg:left-56',
        className,
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-3 md:px-8">
        {children}
      </div>
    </div>,
    document.body,
  )
}
