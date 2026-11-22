import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

import { useCurrentUser } from '@/lib/api/queries'
import { useHaptics } from '@/lib/haptics'
import { useMotionSafe } from '@/lib/motion'
import { cn } from '@/lib/utils'

import { type NavItem, visibleNavItems } from './nav-items'

// row (3.5rem) + top border + the device safe area. the shell reserves exactly
// this much below the content, otherwise the last item of every list ends up
// behind the fixed bar — the classic bug of this component
export const bottomNavInset =
  'pb-[calc(3.5rem+1px+var(--tg-safe-area-bottom))] lg:pb-0'

type BottomNavProps = {
  items: readonly NavItem[]
}

export function BottomNav({ items }: BottomNavProps) {
  const { data: currentUser } = useCurrentUser()
  const motionSafe = useMotionSafe()
  const vibrate = useHaptics()
  const visible = visibleNavItems(items, currentUser?.role)

  return (
    <nav
      aria-label="Navegação principal"
      // z-sticky (50) stays below the overlay (60) on purpose: a bottom sheet
      // covers the bar instead of fighting it for the same strip
      className="bg-background/95 border-border z-sticky pb-safe-bottom fixed inset-x-0 bottom-0 border-t backdrop-blur-md lg:hidden"
    >
      <ul className="flex items-stretch">
        {visible.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                onClick={() => vibrate()}
                className={({ isActive }) =>
                  cn(
                    'text-2xs min-h-touch-min min-w-touch-min flex h-14 flex-col items-center justify-center gap-1 font-medium transition-colors',
                    'focus-visible:ring-tg-brand-yellow/60 focus-visible:ring-2 focus-visible:-outline-offset-2 focus-visible:outline-none',
                    isActive
                      ? 'text-tg-brand-text'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative isolate inline-flex items-center justify-center rounded-full px-4 py-1">
                      {isActive ? (
                        <motion.span
                          layoutId="bottom-nav-pill"
                          className="bg-tg-brand-yellow absolute inset-0 -z-10 rounded-full"
                          transition={motionSafe.transition({
                            type: 'spring',
                            stiffness: 500,
                            damping: 40,
                          })}
                        />
                      ) : null}
                      <Icon
                        className={cn(
                          'size-5 shrink-0',
                          isActive && 'text-tg-brand-blue-dark',
                        )}
                      />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
