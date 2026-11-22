import { MotionConfig } from 'framer-motion'
import { ArrowLeft, Gauge, Handshake, LayoutGrid, Menu } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { ProfileMenu } from '@/components/navigation/profile-menu'
import {
  type NavItem,
  SideNav,
  SideNavFooter,
} from '@/components/navigation/side-nav'
import { RouteTransition } from '@/components/route-transition'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip'

// only routes that exist: cameras, usuarios and replays fell into the global
// catch-all and threw a signed-in admin out to /sign-in (#36). they come back
// together with their screens
const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: Gauge, end: true },
  { label: 'Quadras', to: '/admin/quadras', icon: LayoutGrid },
  { label: 'Patrocinadores', to: '/admin/patrocinadores', icon: Handshake },
]

// layout do administrador: topbar azul + sidebar escuro + main
export function AdminLayout() {
  return (
    // reducedMotion="user" is what honors prefers-reduced-motion for every
    // framer animation in this area; it lives here, not at the root, so the
    // auth entry chunk does not preload framer-motion
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <div className="bg-background text-foreground flex min-h-svh flex-col">
          <header className="bg-tg-brand-blue z-sticky h-header pt-safe-top sticky top-0 flex shrink-0 items-center justify-between px-4 text-white shadow-sm md:px-6">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Abrir menu"
                    className="rounded-full text-white hover:bg-white/10 hover:text-white lg:hidden"
                  >
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-sidebar text-sidebar-foreground flex w-64 flex-col justify-between border-none p-0"
                >
                  <div>
                    <SheetHeader className="border-sidebar-border/40 border-b">
                      <SheetTitle className="text-sidebar-foreground">
                        <Logo to="/admin" />
                      </SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <SideNav
                        items={NAV_ITEMS}
                        pillId="admin-nav-pill-mobile"
                      />
                    </div>
                  </div>
                  <div className="border-sidebar-border/40 border-t py-4">
                    <SideNavFooter />
                  </div>
                </SheetContent>
              </Sheet>
              <Logo to="/admin" className="text-xl md:text-2xl" />
            </div>

            <div className="flex items-center gap-1">
              <ProfileMenu
                className="rounded-full text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
                extraItems={
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/app">
                        <ArrowLeft className="size-4" />
                        Voltar ao app
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                }
              />
              <ThemeToggle />
            </div>
          </header>

          <div className="flex flex-1">
            <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border z-sidebar top-header sticky hidden h-[calc(100svh-var(--tg-header-height))] w-56 shrink-0 flex-col justify-between overflow-y-auto border-r py-6 lg:flex">
              <SideNav items={NAV_ITEMS} pillId="admin-nav-pill" />
              <SideNavFooter />
            </aside>

            <main className="min-w-0 flex-1 p-4 md:p-8">
              <RouteTransition>
                <Outlet />
              </RouteTransition>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </MotionConfig>
  )
}
