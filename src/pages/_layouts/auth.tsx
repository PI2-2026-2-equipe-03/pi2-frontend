import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { RouteTransition } from '@/components/route-transition'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { AUTH_BG } from '@/lib/assets'
import { motionTokens, useMotionSafe } from '@/lib/motion'

// layout usado nas telas públicas de autenticação (login / criar conta)
export function AuthLayout() {
  const { shouldReduce } = useMotionSafe()

  return (
    <div className="bg-tg-brand-blue-dark relative flex min-h-screen text-white">
      <aside
        className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-cover bg-center p-10 md:flex"
        style={{
          backgroundImage: `linear-gradient(135deg, color-mix(in oklab, var(--tg-brand-blue-dark) 85%, transparent) 0%, color-mix(in oklab, var(--tg-brand-blue) 60%, transparent) 60%, color-mix(in oklab, var(--tg-brand-blue) 35%, transparent) 100%), url('${AUTH_BG}')`,
        }}
      >
        <motion.div
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: motionTokens.durations.slow,
            ease: motionTokens.ease.out,
          }}
        >
          <Logo className="text-3xl drop-shadow-md" />
        </motion.div>

        <motion.div
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: motionTokens.durations.slow,
            delay: 0.2,
            ease: motionTokens.ease.out,
          }}
          className="max-w-md space-y-1"
        >
          <p className="text-3xl leading-tight font-semibold drop-shadow-md">
            Seus melhores momentos,
          </p>
          <p className="text-3xl leading-tight font-semibold drop-shadow-md">
            sempre com você.
          </p>
        </motion.div>

        <p className="text-sm text-white/75">© 2026 TaGravado</p>
      </aside>

      <main className="bg-background text-foreground flex flex-1 items-center justify-center p-6">
        <RouteTransition>
          <Outlet />
        </RouteTransition>
      </main>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}
