import { motion } from 'framer-motion'
import { LogOut, Menu, User } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Logo } from '@/components/logo'
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
import { cn } from '@/lib/utils'

// itens do menu lateral — painel admin (dashboard / câmeras / quadras / usuários / replays)
type NavItem = { label: string; to: string; end?: boolean }

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', to: '/admin', end: true },
  { label: 'Câmeras', to: '/admin/cameras' },
  { label: 'Quadras', to: '/admin/quadras' },
  { label: 'Usuários', to: '/admin/usuarios' },
  { label: 'Replays', to: '/admin/replays' },
]

function AdminNav({
  onNavigate,
  pillId = 'admin-nav-pill',
}: {
  onNavigate?: () => void
  pillId?: string
}) {
  return (
    <nav className="flex flex-col gap-2 px-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'relative isolate rounded-full px-5 py-2 text-base font-medium transition-colors',
              'focus-visible:ring-tg-brand-yellow/60 focus-visible:ring-2 focus-visible:outline-none',
              isActive
                ? 'text-tg-brand-blue-dark'
                : 'text-sidebar-foreground/90 hover:bg-tg-brand-yellow/20 hover:text-sidebar-accent-foreground',
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <motion.span
                  layoutId={pillId}
                  className="bg-tg-brand-yellow absolute inset-0 -z-10 rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function AdminFooter({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()

  return (
    <div className="px-3">
      <button
        type="button"
        onClick={() => {
          onNavigate?.()
          navigate('/sign-in')
        }}
        className="text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md px-5 py-2 text-left text-base font-medium"
      >
        <LogOut className="size-4" />
        Sair
      </button>
    </div>
  )
}

// layout do administrador — topbar azul + sidebar escuro + main
// container tem altura fixa da viewport (h-screen); scroll acontece dentro do <main>,
// para header e sidebar ficarem sempre ancorados independentemente do tamanho do conteúdo.
export function AdminLayout() {
  return (
    <div className="bg-tg-brand-bg text-foreground flex min-h-svh flex-col">
      <header className="bg-tg-brand-blue sticky top-0 z-sticky flex h-16 shrink-0 items-center justify-between px-4 text-white shadow-sm md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Abrir menu"
                className="rounded-full text-white hover:bg-white/10 hover:text-white md:hidden"
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
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <AdminNav pillId="admin-nav-pill-mobile" />
                </div>
              </div>
              <div className="border-sidebar-border/40 border-t py-4">
                <AdminFooter />
              </div>
            </SheetContent>
          </Sheet>
          <Logo className="text-2xl" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
              <User className="size-4" />
            </span>
            <span className="text-sm font-medium">Admin</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="bg-sidebar text-sidebar-foreground z-sidebar sticky top-16 hidden h-[calc(100svh-4rem)] w-56 shrink-0 flex-col justify-between overflow-y-auto py-6 md:flex">
          <AdminNav />
          <AdminFooter />
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
