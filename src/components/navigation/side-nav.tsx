import { motion } from 'framer-motion'
import { LogOut, User } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { useCurrentUser } from '@/lib/api/queries'
import { signOut } from '@/lib/auth/session'
import { cn } from '@/lib/utils'

import { type NavItem, visibleNavItems } from './nav-items'

// the type moved next to the item lists it describes; re-exported so the
// layouts keep importing it from here
export type { NavItem }

const rowClasses =
  'text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-tg-brand-yellow/60 min-h-touch-min flex items-center gap-2 rounded-md px-3 py-2 text-left dense:min-h-0 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none'

type SideNavProps = {
  items: readonly NavItem[]
  onNavigate?: () => void
  // desktop and mobile sheet are mounted together; ids must not collide
  pillId?: string
}

export function SideNav({
  items,
  onNavigate,
  pillId = 'side-nav-pill',
}: SideNavProps) {
  const { data: currentUser } = useCurrentUser()
  const visible = visibleNavItems(items, currentUser?.role)

  return (
    <nav className="flex flex-col gap-1 px-3">
      {visible.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'min-h-touch-min dense:min-h-0 relative isolate flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'focus-visible:ring-tg-brand-yellow/60 focus-visible:ring-2 focus-visible:outline-none',
                isActive
                  ? 'text-tg-brand-blue-dark'
                  : 'text-sidebar-foreground/90 hover:bg-tg-brand-yellow/25 hover:text-sidebar-accent-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <motion.span
                    layoutId={pillId}
                    className="bg-tg-brand-yellow absolute inset-0 -z-10 rounded-md shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                ) : null}
                <Icon className="relative size-4 shrink-0" />
                <span className="relative">{item.label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

type SideNavFooterProps = {
  onNavigate?: () => void
  // admin has no profile screen of its own, so it omits the shortcut
  profileTo?: string
}

export function SideNavFooter({ onNavigate, profileTo }: SideNavFooterProps) {
  const navigate = useNavigate()

  async function handleLogout() {
    onNavigate?.()
    await signOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <div className="flex flex-col gap-1 px-3">
      {profileTo ? (
        <Link to={profileTo} onClick={onNavigate} className={rowClasses}>
          <User className="size-4" />
          Perfil
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => {
          void handleLogout()
        }}
        className={rowClasses}
      >
        <LogOut className="size-4" />
        Sair
      </button>
    </div>
  )
}
