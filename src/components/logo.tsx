import { motion } from 'framer-motion'

import { useMotionSafe } from '@/lib/motion'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
}

// wordmark tagravado — "g" em amarelo (marca) com micro-wiggle no hover
export function Logo({ className }: LogoProps) {
  const { shouldReduce } = useMotionSafe()

  return (
    <span className={cn('group font-bold tracking-tight', className)}>
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
}
