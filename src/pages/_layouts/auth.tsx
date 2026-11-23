import { Outlet } from 'react-router-dom'

import authBg from '@/assets/auth-bg.webp'
import {
  headerIconClasses,
  SiteHeader,
} from '@/components/navigation/site-header'
import { RouteTransition } from '@/components/route-transition'
import { ThemeToggle } from '@/components/theme/theme-toggle'

// layout usado nas telas públicas de autenticação (login / criar conta)
// the panel entrance is css (tw-animate-css), same reasoning as route-fade-in:
// this is the product's first paint, so a motion lib here would load before it
// (RNF-03). motion-safe keeps fade-only under reduced motion, as framer did.
export function AuthLayout() {
  return (
    // svh ignores the retractable address bar, so the layout does not jump
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <SiteHeader logoTo="/sign-in">
        <ThemeToggle className={headerIconClasses} />
      </SiteHeader>

      {/* from md the row is capped to the viewport so the aside stops growing
          with the form and its tagline stays on screen. below md the page keeps
          its own scroll: a scroller inside a container fights the virtual
          keyboard on a phone. */}
      <div className="flex flex-1 md:h-[calc(100svh-var(--tg-header-height))] md:flex-none">
        {/* the logo lives in the header now: the panel keeps only the tagline */}
        <aside
          className="bg-tg-brand-blue-dark relative hidden flex-1 flex-col justify-end gap-8 overflow-hidden bg-cover bg-center p-10 text-white md:flex"
          style={{
            backgroundImage: `linear-gradient(135deg, color-mix(in oklab, var(--tg-brand-blue-dark) 85%, transparent) 0%, color-mix(in oklab, var(--tg-brand-blue) 60%, transparent) 60%, color-mix(in oklab, var(--tg-brand-blue) 35%, transparent) 100%), url('${authBg}')`,
          }}
        >
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

        {/* the form column is the only scroller from md. centring with m-auto
            instead of items-center on purpose: an overflowing flex item centred
            on the cross axis puts its top above the scroll origin, where no
            amount of scrolling reaches it. */}
        <main className="flex flex-1 justify-center p-4 sm:p-6 md:overflow-y-auto">
          <div className="m-auto">
            <RouteTransition>
              <Outlet />
            </RouteTransition>
          </div>
        </main>
      </div>
    </div>
  )
}
