import { Outlet } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { AUTH_BG } from '@/lib/assets'

// layout usado nas telas públicas de autenticação (login / criar conta)
export function AuthLayout() {
  return (
    <div className="bg-tg-brand-blue-dark relative flex min-h-screen text-white">
      <aside
        className="relative hidden flex-1 flex-col justify-between overflow-hidden p-10 md:flex"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(11,42,117,0.85) 0%, rgba(16,58,158,0.6) 60%, rgba(16,58,158,0.35) 100%), url('${AUTH_BG}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Logo className="text-3xl drop-shadow-md" />
        <div className="max-w-md space-y-1">
          <p className="text-3xl leading-tight font-semibold drop-shadow-md">
            Seus melhores momentos,
          </p>
          <p className="text-3xl leading-tight font-semibold drop-shadow-md">
            sempre com você.
          </p>
        </div>
        <p className="text-sm text-white/75">© 2026 TaGravado</p>
      </aside>

      <main className="bg-background text-foreground flex flex-1 items-center justify-center p-6">
        <Outlet />
      </main>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}
