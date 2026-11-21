import { AnimatePresence, motion } from 'framer-motion'
import {
  Briefcase,
  Film,
  Home,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSessionGuard } from '@/lib/auth/session'
import { useMotionSafe } from '@/lib/motion'
import { useScrolled } from '@/lib/use-scrolled'
import { cn } from '@/lib/utils'

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Início', to: '/app', icon: Home, end: true },
  { label: 'Replays', to: '/app/replays', icon: Film },
  { label: 'Arenas', to: '/app/arenas', icon: MapPin },
  { label: 'Quadras', to: '/app/quadras', icon: LayoutGrid },
  {
    label: 'Solicitar gestão',
    to: '/app/solicitar-gestor',
    icon: Briefcase,
    roles: ['USR'],
  },
  {
    label: 'Gestão',
    to: '/admin',
    icon: LayoutDashboard,
    roles: ['ADM', 'CLI'],
  },
]

const headerIconClasses =
  'size-9 rounded-full text-white transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-white/40'

export function AppLayout() {
  const { data: session, isPending } = useSessionGuard()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const motionSafe = useMotionSafe()
  const scrolled = useScrolled(8)

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  if (isPending || !session) {
    return null
  }

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <header
        data-scrolled={scrolled}
        className={cn(
          'bg-tg-brand-blue z-sticky sticky top-0 flex h-16 shrink-0 items-center justify-between px-4 text-white transition-shadow duration-200 ease-out md:px-6',
          scrolled ? 'shadow-md' : 'shadow-sm',
          'motion-reduce:transition-none',
        )}
      >
        <div className="flex items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                className={cn(headerIconClasses, 'size-10 md:hidden')}
              >
                <AnimatePresence initial={false} mode="wait">
                  {mobileMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={motionSafe.prop({ rotate: -90, opacity: 0 })}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={motionSafe.prop({ rotate: 90, opacity: 0 })}
                      transition={motionSafe.transition({ duration: 0.2 })}
                      className="inline-flex"
                    >
                      <X className="size-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={motionSafe.prop({ rotate: 90, opacity: 0 })}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={motionSafe.prop({ rotate: -90, opacity: 0 })}
                      transition={motionSafe.transition({ duration: 0.2 })}
                      className="inline-flex"
                    >
                      <Menu className="size-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-sidebar text-sidebar-foreground flex w-72 flex-col justify-between border-none p-0"
            >
              <div>
                <SheetHeader className="border-sidebar-border/40 border-b">
                  <SheetTitle className="text-sidebar-foreground">
                    <Logo to="/app" />
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <SideNav
                    items={NAV_ITEMS}
                    pillId="app-nav-pill-mobile"
                    onNavigate={closeMobileMenu}
                  />
                </div>
              </div>
              <div className="border-sidebar-border/40 border-t py-4">
                <SideNavFooter
                  profileTo="/app/perfil"
                  onNavigate={closeMobileMenu}
                />
              </div>
            </SheetContent>
          </Sheet>
          <Logo to="/app" className="text-xl md:text-2xl" />
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle className={headerIconClasses} />

          <ProfileMenu className={headerIconClasses} />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border z-sidebar sticky top-16 hidden h-[calc(100svh-4rem)] w-56 shrink-0 flex-col justify-between overflow-y-auto border-r py-6 md:flex">
          <SideNav items={NAV_ITEMS} pillId="app-nav-pill" />
          <SideNavFooter profileTo="/app/perfil" />
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <RouteTransition>
            <Outlet />
          </RouteTransition>
        </main>
      </div>
    </div>
  )
}
