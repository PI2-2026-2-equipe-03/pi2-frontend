// tokens de motion espelhados em JS para consumo pelo framer-motion.
// mantidos em sincronia com --motion-* de src/style.css.
export const motionTokens = {
  durations: {
    fast: 0.15,
    base: 0.25,
    slow: 0.4,
  },
  ease: {
    out: [0.16, 1, 0.3, 1] as const,
    spring: [0.34, 1.56, 0.64, 1] as const,
  },
} as const

// transições prontas para uso em <motion.*>
export const transitions = {
  fadeIn: {
    duration: motionTokens.durations.base,
    ease: motionTokens.ease.out,
  },
  slideUp: {
    duration: motionTokens.durations.slow,
    ease: motionTokens.ease.out,
  },
} as const
