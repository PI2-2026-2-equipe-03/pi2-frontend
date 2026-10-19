import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { useMotionSafe } from '@/lib/motion'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  // destino opcional — quando presente, a logo vira link clicável.
  // cada layout escolhe seu alvo (/sign-in nas telas de auth, /app no cliente, /admin no admin).
  to?: string
}

// wordmark tagravado — "g" em amarelo (marca) com micro-wiggle no hover.
export function Logo({ className, to }: LogoProps) {
  const { shouldReduce } = useMotionSafe()

  const wordmark = (
    // nowrap: no header estreito do admin o flex encolhia a logo até "TaG / ravado"
    <span
      className={cn(
        'group font-bold tracking-tight whitespace-nowrap',
        className,
      )}
    >
      Ta
      <motion.span
        className="text-tg-brand-yellow inline-block"
        whileHover={
          shouldReduce
            ? undefined
            : {
                rotate: [0, -8, 8, -4, 0],
                transition: { duration: 0.6 },
              }
        }
      >
        G
      </motion.span>
      ravado
    </span>
  )

  if (!to) return wordmark

  return (
    <Link
      to={to}
      aria-label="Ir para a página inicial"
      className="focus-visible:ring-tg-brand-yellow/60 inline-block rounded-sm transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
    >
      {wordmark}
    </Link>
  )
}
