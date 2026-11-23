import { ArrowDown, RefreshCw } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'

import { useHaptics } from '@/lib/haptics'
import { useMotionSafe } from '@/lib/motion'
import { usePullToRefresh } from '@/lib/use-pull-to-refresh'
import { cn } from '@/lib/utils'

const RELEASE_MS = 200
// the strip fades in over the first third of the pull instead of popping
const FADE_IN_PX = 48

type PullToRefreshProps = {
  onRefresh: () => Promise<unknown> | void
  /** off while there is nothing to refresh yet (first load, error state) */
  disabled?: boolean
  className?: string
  children: ReactNode
}

// the gesture is a shortcut, never the only way to reload: every screen that
// uses it keeps its own retry and filter controls reachable by keyboard
export function PullToRefresh({
  onRefresh,
  disabled = false,
  className,
  children,
}: PullToRefreshProps) {
  const { ref, distance, isRefreshing, isArmed, isDragging } = usePullToRefresh(
    { onRefresh, disabled },
  )
  const { shouldReduce } = useMotionSafe()
  const vibrate = useHaptics()

  // the buzz marks the moment releasing would refresh, which is the one thing
  // the finger cannot see under itself
  useEffect(() => {
    if (isArmed && isDragging) vibrate()
  }, [isArmed, isDragging, vibrate])

  const open = distance > 0
  // following the finger is direct manipulation, not an animation; only the
  // spring back and the spinner answer to prefers-reduced-motion
  const animated = !isDragging && !shouldReduce

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center overflow-hidden"
        style={{
          height: distance,
          opacity: Math.min(1, distance / FADE_IN_PX),
        }}
      >
        {isRefreshing ? (
          <RefreshCw
            className={cn('size-5', !shouldReduce && 'animate-spin')}
          />
        ) : (
          <ArrowDown
            className={cn(
              'size-5',
              isArmed && 'text-tg-brand-text',
              !shouldReduce && 'transition-transform duration-150',
              isArmed && !shouldReduce && 'rotate-180',
            )}
          />
        )}
      </div>

      {/* the strip itself is decoration; the state is announced from here */}
      <span role="status" aria-live="polite" className="sr-only">
        {isRefreshing ? 'Atualizando a lista' : ''}
      </span>

      <div
        style={{
          transform: open ? `translateY(${distance}px)` : undefined,
          transition: animated
            ? `transform ${RELEASE_MS}ms ease-out`
            : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}
