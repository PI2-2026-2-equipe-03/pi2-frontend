import { Outlet } from 'react-router-dom'

import authBg from '@/assets/auth-bg.webp'
import { Logo } from '@/components/logo'
import { RouteTransition } from '@/components/route-transition'
import { ThemeToggle } from '@/components/theme/theme-toggle'

// layout usado nas telas públicas de autenticação (login / criar conta)
// the panel entrance is css (tw-animate-css), same reasoning as route-fade-in:
// this is the product's first paint, so a motion lib here would load before it
// (RNF-03). motion-safe keeps fade-only under reduced motion, as framer did.
export function AuthLayout() {
  return (
    <div className="bg-tg-brand-blue-dark relative flex min-h-screen text-white">
      <aside
        className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-cover bg-center p-10 md:flex"
        style={{
          backgroundImage: `linear-gradient(135deg, color-mix(in oklab, var(--tg-brand-blue-dark) 85%, transparent) 0%, color-mix(in oklab, var(--tg-brand-blue) 60%, transparent) 60%, color-mix(in oklab, var(--tg-brand-blue) 35%, transparent) 100%), url('${authBg}')`,
        }}
      >
        <div className="animate-in fade-in-0 motion-safe:slide-in-from-left-4 duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-out)]">
          <Logo to="/sign-in" className="text-3xl drop-shadow-md" />
        </div>

        {/* fill-mode-backwards: without it the text would show opaque during
            the 200ms delay, then blink out to animate in */}
        <div className="animate-in fade-in-0 fill-mode-backwards motion-safe:slide-in-from-left-4 max-w-md space-y-1 delay-200 duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-out)]">
          <p className="text-3xl leading-tight font-semibold drop-shadow-md">
            Seus melhores momentos,
          </p>
          <p className="text-3xl leading-tight font-semibold drop-shadow-md">
            sempre com você.
          </p>
        </div>

        <p className="text-sm text-white/75">© 2026 repeteco</p>
      </aside>

      <main className="bg-background text-foreground flex flex-1 items-center justify-center p-6">
        <RouteTransition>
          <Outlet />
        </RouteTransition>
      </main>

      {/* flutua sobre o painel claro, não sobre o aside azul: sem cor própria
          herdaria o text-white do wrapper e sumiria no fundo */}
      <div className="absolute top-4 right-4">
        <ThemeToggle className="text-foreground" />
      </div>
    </div>
  )
}
