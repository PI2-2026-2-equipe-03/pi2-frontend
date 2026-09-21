import { Outlet } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme/theme-toggle'

// layout usado nas telas públicas de autenticação (login / criar conta)
export function AuthLayout() {
  return (
    <div className="bg-tg-brand-blue-dark relative flex min-h-screen text-white">
      <aside className="relative hidden flex-1 flex-col justify-between p-10 md:flex">
        <Logo className="text-3xl" />
        <div className="max-w-md">
          <p className="text-3xl leading-tight font-semibold">
            Seus melhores momentos,
          </p>
          <p className="text-3xl leading-tight font-semibold">
            sempre com você.
          </p>
        </div>
        <p className="text-sm text-white/60">© 2026 TaGravado</p>
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
