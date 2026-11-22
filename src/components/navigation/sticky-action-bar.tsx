import type { ReactElement } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

// padding(0.75rem * 2) + the 48px primary action + top border + the device safe
// area. pages reserve exactly this much below their content, otherwise the last
// field ends up behind the fixed bar (same contract as bottomNavInset)
export const stickyActionBarInset =
  'pb-[calc(4.5rem+1px+var(--tg-safe-area-bottom))]'

type StickyActionBarProps = {
  // one action per bar: the inset above is sized for a single 48px row, a
  // second button would grow the bar past what the page reserved
  children: ReactElement
  // names the landmark, so it is reachable apart from the form it submits
  label: string
  className?: string
}

// portaled to <body>: the route transition animates a transform on an
// ancestor, and a transformed ancestor turns `fixed` into "fixed to that box"
export function StickyActionBar({
  children,
  label,
  className,
}: StickyActionBarProps) {
  return createPortal(
    <div
      data-slot="sticky-action-bar"
      role="region"
      aria-label={label}
      // z-sticky (50) sits below overlays and modals on purpose: a dialog
      // covers the bar instead of negotiating with it. lg:left-56 leaves the
      // app sidebar (w-56) alone, it is the one thing that outranks the bar
      className={cn(
        'bg-background/95 border-border z-sticky pb-safe-bottom fixed inset-x-0 bottom-0 border-t backdrop-blur-md lg:left-56',
        className,
      )}
    >
      {/* padding outside, max-width inside: same order as the page, so the
          button lines up with the content column at every width */}
      <div className="px-4 py-3 md:px-8">
        <div className="mx-auto max-w-2xl">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
