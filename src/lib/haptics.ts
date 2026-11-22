import { useCallback } from 'react'

import { useMotionSafe } from '@/lib/motion'

// 10ms is a tap, not a buzz: it confirms the finger landed on the target
// without turning navigation into a rumble
const TAP_MS = 10

// vibration is movement nobody asked for, so it rides the same switch as the
// animations (prefers-reduced-motion)
export function useHaptics() {
  const { shouldReduce } = useMotionSafe()

  return useCallback(
    (durationMs: number = TAP_MS) => {
      if (shouldReduce) return
      // missing on desktop and on ios safari, which never shipped the api
      if (typeof navigator.vibrate !== 'function') return
      navigator.vibrate(durationMs)
    },
    [shouldReduce],
  )
}
