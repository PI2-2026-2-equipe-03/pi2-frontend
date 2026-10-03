import { useEffect, useState } from 'react'

export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.scrollY > threshold
  })

  useEffect(() => {
    let frame = 0

    function update() {
      frame = 0
      setScrolled(window.scrollY > threshold)
    }

    function onScroll() {
      if (frame !== 0) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}
