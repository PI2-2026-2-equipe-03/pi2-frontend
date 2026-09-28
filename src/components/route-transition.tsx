import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { motionTokens, useMotionSafe } from '@/lib/motion'

type RouteTransitionProps = {
  children: ReactNode
}

// envolve o outlet com AnimatePresence — fade+slide na troca de rota
// respeita prefers-reduced-motion via useMotionSafe.
export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation()
  const { shouldReduce } = useMotionSafe()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{
          duration: motionTokens.durations.base,
          ease: motionTokens.ease.out,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
