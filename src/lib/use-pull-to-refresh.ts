import { useCallback, useEffect, useRef, useState } from 'react'

// how far the finger has to travel before the release counts as a refresh
const TRIGGER_PX = 72
// the strip stops following past this, so a long drag cannot shove the list
// off the screen
const MAX_PX = 112
// the strip moves half of what the finger does: the drag feels like it is
// pulling against something, and a scroll that was meant as a flick is cheap
// to abandon
const RESISTANCE = 0.5
// below this the gesture is still ambiguous between a pull and a sideways
// swipe, so it is too early to take the touch away from the browser
const DIRECTION_SLOP_PX = 8

type Phase = 'idle' | 'deciding' | 'pulling' | 'declined'

type UsePullToRefreshOptions = {
  onRefresh: () => Promise<unknown> | void
  disabled?: boolean
}

export type UsePullToRefreshResult = {
  /** attach to the element the gesture starts on */
  ref: (node: HTMLElement | null) => void
  /** px the content should be pushed down by, 0 when idle */
  distance: number
  isRefreshing: boolean
  /** the pull is far enough that releasing now refreshes */
  isArmed: boolean
  /** no transition while the finger is down: the strip tracks the touch */
  isDragging: boolean
}

// the window is the scroll root of every screen in this app (the shell is a
// min-h-svh column, not an overflow container)
function atTop(): boolean {
  return window.scrollY <= 0
}

export function usePullToRefresh({
  onRefresh,
  disabled = false,
}: UsePullToRefreshOptions): UsePullToRefreshResult {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [distance, setDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const phase = useRef<Phase>('idle')
  const start = useRef({ x: 0, y: 0 })
  // the handlers are attached once (touchmove must be non-passive, so it
  // cannot be re-registered on every render) and read the live callback here
  const refresh = useRef(onRefresh)
  refresh.current = onRefresh
  const blocked = useRef(disabled)
  blocked.current = disabled
  const refreshing = useRef(false)
  refreshing.current = isRefreshing
  // the touch handlers need the committed distance, which state would only
  // hand them one render later
  const pulled = useRef(0)

  const ref = useCallback((next: HTMLElement | null) => setNode(next), [])

  useEffect(() => {
    if (!node) return

    function applyDistance(next: number) {
      pulled.current = next
      setDistance(next)
    }

    function onTouchStart(event: TouchEvent) {
      if (blocked.current || refreshing.current) return
      // a second finger means pinch or scroll, never a pull
      if (event.touches.length !== 1) {
        phase.current = 'declined'
        return
      }
      if (!atTop()) {
        phase.current = 'declined'
        return
      }
      const touch = event.touches[0]
      start.current = { x: touch.clientX, y: touch.clientY }
      phase.current = 'deciding'
    }

    function onTouchMove(event: TouchEvent) {
      if (phase.current === 'idle' || phase.current === 'declined') return

      const touch = event.touches[0]
      if (!touch) return
      const dy = touch.clientY - start.current.y
      const dx = touch.clientX - start.current.x

      if (phase.current === 'deciding') {
        // a scroll up, a sideways swipe, or a list that moved off the top in
        // the meantime: hand the gesture back instead of hijacking the scroll
        if (dy < -DIRECTION_SLOP_PX || Math.abs(dx) > Math.abs(dy)) {
          phase.current = 'declined'
          return
        }
        if (dy < DIRECTION_SLOP_PX) return
        if (!atTop()) {
          phase.current = 'declined'
          return
        }
        phase.current = 'pulling'
        setIsDragging(true)
      }

      // from here the pull owns the touch: without this the browser runs its
      // own pull-to-refresh on top of ours
      if (event.cancelable) event.preventDefault()
      applyDistance(Math.round(Math.min(MAX_PX, Math.max(0, dy) * RESISTANCE)))
    }

    function onTouchEnd() {
      if (phase.current !== 'pulling') {
        phase.current = 'idle'
        return
      }
      phase.current = 'idle'
      setIsDragging(false)

      if (pulled.current < TRIGGER_PX) {
        applyDistance(0)
        return
      }
      // hold the strip open at the trigger height while the query reloads
      applyDistance(TRIGGER_PX)
      setIsRefreshing(true)
    }

    node.addEventListener('touchstart', onTouchStart, { passive: true })
    node.addEventListener('touchmove', onTouchMove, { passive: false })
    node.addEventListener('touchend', onTouchEnd, { passive: true })
    node.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      node.removeEventListener('touchstart', onTouchStart)
      node.removeEventListener('touchmove', onTouchMove)
      node.removeEventListener('touchend', onTouchEnd)
      node.removeEventListener('touchcancel', onTouchEnd)
      phase.current = 'idle'
      applyDistance(0)
      setIsDragging(false)
    }
  }, [node])

  // the await lives in an effect, not in the touch handler, so a refresh that
  // rejects still closes the strip
  useEffect(() => {
    if (!isRefreshing) return
    let cancelled = false

    void Promise.resolve(refresh.current()).finally(() => {
      if (cancelled) return
      setIsRefreshing(false)
      pulled.current = 0
      setDistance(0)
    })

    return () => {
      cancelled = true
    }
  }, [isRefreshing])

  return {
    ref,
    distance,
    isRefreshing,
    isArmed: distance >= TRIGGER_PX,
    isDragging,
  }
}
