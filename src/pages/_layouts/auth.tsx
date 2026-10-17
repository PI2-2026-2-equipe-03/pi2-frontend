import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { RouteTransition } from '@/components/route-transition'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { motionTokens, useMotionSafe } from '@/lib/motion'

// layout usado nas telas públicas de autenticação (login / criar conta)
export function AuthLayout() {
  const { shouldReduce } = useMotionSafe()

  return (
    <div className="bg-tg-brand-blue-dark relative flex min-h-screen text-white">
      <aside
        className="relative hidden flex-1 flex-col justify-between overflow-hidden p-10 md:flex"
        style={{
          backgroundImage: `linear-gradient(135deg, var(--tg-brand-blue-dark) 0%, var(--tg-brand-blue) 55%, color-mix(in oklab, var(--tg-brand-blue) 72%, var(--tg-brand-yellow)) 100%)`,
        }}
      >
        {/* marca d'água vetorial em vez de foto de banco de imagem: a tela de
            login precisa pintar sem depender de CDN de terceiro, e foto de
            quadra alheia não representa arena nenhuma do sistema. */}
        <svg
          aria-hidden
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute inset-0 size-full text-white/[0.07]"
        >
          <rect x="24" y="24" width="352" height="552" rx="6" />
          <line x1="24" y1="300" x2="376" y2="300" />
          <circle cx="200" cy="300" r="66" />
          <rect x="112" y="24" width="176" height="88" />
          <rect x="112" y="488" width="176" height="88" />
        </svg>

        <motion.div
          className="relative"
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: motionTokens.durations.slow,
            ease: motionTokens.ease.out,
          }}
        >
          <Logo to="/sign-in" className="text-3xl drop-shadow-md" />
        </motion.div>

        <motion.div
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: motionTokens.durations.slow,
            delay: 0.2,
            ease: motionTokens.ease.out,
          }}
          className="relative max-w-md space-y-1"
        >
          <p className="text-3xl leading-tight font-semibold drop-shadow-md">
            Seus melhores momentos,
          </p>
          <p className="text-3xl leading-tight font-semibold drop-shadow-md">
            sempre com você.
          </p>
        </motion.div>

        <p className="relative text-sm text-white/75">© 2026 TaGravado</p>
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
