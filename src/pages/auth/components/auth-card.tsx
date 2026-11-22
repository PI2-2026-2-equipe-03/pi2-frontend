import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

// full-width submit of the auth cards: grows instead of overflowing when the
// label wraps at 320px
export const authSubmitClasses =
  'h-auto min-h-touch-min w-full whitespace-normal dense:min-h-9'

// shell shared by the auth screens; the padding only grows from sm so the
// card fits a 320px viewport
export function AuthCard({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="auth-card"
      className={cn(
        'bg-card border-border w-full max-w-md rounded-xl border p-5 shadow-sm sm:p-8',
        className,
      )}
      {...props}
    />
  )
}
