import { MotionConfig } from 'framer-motion'
import { Outlet, useMatches } from 'react-router-dom'

import { BottomNav, bottomNavInset } from '@/components/navigation/bottom-nav'
import { APP_NAV_ITEMS, APP_TAB_ITEMS } from '@/components/navigation/nav-items'
import { ProfileMenu } from '@/components/navigation/profile-menu'
import { SideNav, SideNavFooter } from '@/components/navigation/side-nav'
import {
  headerIconClasses,
  SiteHeader,
} from '@/components/navigation/site-header'
import { RouteTransition } from '@/components/route-transition'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useSessionGuard } from '@/lib/auth/session'
import { cn } from '@/lib/utils'

export type RouteHandle = { hideBottomNav?: boolean }

export function AppLayout() {
  const { data: session, isPending } = useSessionGuard()
  // focused flows (route handle) swap the tab bar for their own action bar:
  // two fixed strips would eat a small phone screen
  const hideBottomNav = useMatches().some(
    (match) => (match.handle as RouteHandle | undefined)?.hideBottomNav,
  )

  if (isPending || !session) {
    return null
  }

  return (
    // reducedMotion="user" is what honors prefers-reduced-motion for every
    // framer animation in this area; it lives here, not at the root, so the
    // auth entry chunk does not preload framer-motion
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <div className="bg-background text-foreground flex min-h-svh flex-col">
          {/* the hamburger is gone: below lg the BottomNav navigates, and the
              sections that missed the 4 tabs live inside the profile (d-01) */}
          <SiteHeader logoTo="/app">
            <ThemeToggle className={headerIconClasses} />
            <ProfileMenu className={headerIconClasses} />
          </SiteHeader>

          {/* the inset lives on the row, not on <main>, so it adds to the page
              padding instead of competing with it */}
          <div className={cn('flex flex-1', !hideBottomNav && bottomNavInset)}>
            <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border z-sidebar top-header sticky hidden h-[calc(100svh-var(--tg-header-height))] w-56 shrink-0 flex-col justify-between overflow-y-auto border-r py-6 lg:flex">
              <SideNav items={APP_NAV_ITEMS} pillId="app-nav-pill" />
              <SideNavFooter profileTo="/app/perfil" />
            </aside>

            <main className="min-w-0 flex-1 p-4 md:p-8">
              <RouteTransition>
                <Outlet />
              </RouteTransition>
            </main>
          </div>

          {hideBottomNav ? null : <BottomNav items={APP_TAB_ITEMS} />}
        </div>
      </TooltipProvider>
    </MotionConfig>
  )
}
