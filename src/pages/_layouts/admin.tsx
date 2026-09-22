import { User } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme/theme-toggle'
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

// layout do administrador — topbar azul + sidebar escuro + main
export function AdminLayout() {
  const navigate = useNavigate()

  return (
    <div className="bg-tg-brand-bg text-foreground flex min-h-screen flex-col">
      <header className="bg-tg-brand-blue flex items-center justify-between px-6 py-4 text-white">
        <Logo className="text-2xl" />
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
        <aside className="bg-sidebar text-sidebar-foreground hidden w-56 shrink-0 flex-col justify-between py-6 md:flex">
          <nav className="flex flex-col gap-2 px-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'px-5 py-2 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-tg-brand-yellow text-tg-brand-blue-dark rounded-full'
                      : 'text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="px-3">
            <button
              type="button"
              onClick={() => navigate('/sign-in')}
              className="text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md px-5 py-2 text-left text-base font-medium"
            >
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
