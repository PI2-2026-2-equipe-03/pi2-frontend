import { useEffect, useState } from 'react'

// how much of the layout viewport the on-screen keyboard covers, in px.
// ios (and chrome since 108) shrink only the visual viewport, so anything
// pinned to bottom: 0 ends up behind the keyboard without this offset
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    function update() {
      if (!viewport) return
      const layoutHeight = document.documentElement.clientHeight
      const covered = layoutHeight - (viewport.height + viewport.offsetTop)
      // sub-pixel noise from zoom and the url bar is not a keyboard
      setInset(covered > 1 ? Math.round(covered) : 0)
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  return inset
}
