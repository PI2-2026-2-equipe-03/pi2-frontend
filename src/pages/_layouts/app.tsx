import { LogOut, Star, User } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// itens do menu lateral — reflete os wireframes de "início / meus replays / arenas / quadras"
type NavItem = { label: string; to: string; end?: boolean }

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Início', to: '/app', end: true },
  { label: 'Meus replays', to: '/app/replays' },
  { label: 'Arenas', to: '/app/arenas' },
  { label: 'Quadras', to: '/app/quadras' },
]

// layout autenticado — topbar azul + sidebar escuro + main
export function AppLayout() {
  const navigate = useNavigate()

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="bg-tg-brand-blue flex items-center justify-between px-6 py-4 text-white">
        <Logo className="text-2xl" />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Favoritos"
            className="rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            <Star className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Perfil"
            className="rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            <User className="size-4" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="bg-sidebar text-sidebar-foreground hidden w-56 shrink-0 flex-col justify-between py-6 md:flex">
          <nav className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-tg-brand-yellow text-tg-brand-blue-dark'
                      : 'text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-col gap-1 px-3">
            <button
              type="button"
              className="text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium"
            >
              <User className="size-4" />
              Perfil
            </button>
            <button
              type="button"
              onClick={() => navigate('/sign-in')}
              className="text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
