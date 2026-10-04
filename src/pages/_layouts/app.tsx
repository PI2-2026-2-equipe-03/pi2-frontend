import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Film,
  Home,
  LayoutGrid,
  LogOut,
  MapPin,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { RouteTransition } from '@/components/route-transition'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { clearSession, getSession } from '@/lib/auth/session'
import { useMotionSafe } from '@/lib/motion'
import { useScrolled } from '@/lib/use-scrolled'
import { cn } from '@/lib/utils'

type NavItem = { label: string; to: string; icon: LucideIcon; end?: boolean }

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Início', to: '/app', icon: Home, end: true },
  { label: 'Replays', to: '/app/replays', icon: Film },
  { label: 'Arenas', to: '/app/arenas', icon: MapPin },
  { label: 'Quadras', to: '/app/quadras', icon: LayoutGrid },
]

function NavItems({
  onNavigate,
  pillId = 'app-nav-pill',
}: {
  onNavigate?: () => void
  pillId?: string
}) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'relative isolate flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
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

function handleLogout(navigate: ReturnType<typeof useNavigate>) {
  clearSession()
  navigate('/sign-in', { replace: true })
}

function NavFooter({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-1 px-3">
      <button
        type="button"
        onClick={onNavigate}
        className="text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
      >
        <User className="size-4" />
        Perfil
      </button>
      <button
        type="button"
        onClick={() => {
          onNavigate?.()
          handleLogout(navigate)
        }}
        className="text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
      >
        <LogOut className="size-4" />
        Sair
      </button>
    </div>
  )
}

const headerIconClasses =
  'size-9 rounded-full text-white transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-white/40'

export function AppLayout() {
  const navigate = useNavigate()
  const session = getSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const motionSafe = useMotionSafe()
  const scrolled = useScrolled(8)

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <header
        data-scrolled={scrolled}
        className={cn(
          'bg-tg-brand-blue sticky top-0 z-sticky flex h-16 shrink-0 items-center justify-between px-4 text-white transition-shadow duration-200 ease-out md:px-6',
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
                className={cn(
                  headerIconClasses,
                  'size-10 md:hidden',
                )}
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
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <NavItems
                    pillId="app-nav-pill-mobile"
                    onNavigate={closeMobileMenu}
                  />
                </div>
              </div>
              <div className="border-sidebar-border/40 border-t py-4">
                <NavFooter onNavigate={closeMobileMenu} />
              </div>
            </SheetContent>
          </Sheet>
          <Logo className="text-xl md:text-2xl" />
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle className={headerIconClasses} />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Menu do perfil"
                    className={headerIconClasses}
                  >
                    <User className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Perfil</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                {session?.name ?? 'Minha conta'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="size-4" />
                Meu perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => handleLogout(navigate)}
              >
                <LogOut className="size-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="bg-sidebar text-sidebar-foreground z-sidebar sticky top-16 hidden h-[calc(100svh-4rem)] w-56 shrink-0 flex-col justify-between overflow-y-auto py-6 md:flex">
          <NavItems />
          <NavFooter />
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
