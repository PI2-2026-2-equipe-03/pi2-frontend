import { useEffect, useRef, useState } from 'react'

const STORAGE_PREFIX = 'tg:scroll:'
// the offset waits for the list to grow back to the height it had. ~1s at
// 60fps is plenty for cached pages to render; past that, land as close as the
// page allows instead of fighting the layout forever
const MAX_FRAMES = 60

function read(key: string): number | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return null
    const offset = Number(raw)
    return Number.isFinite(offset) && offset > 0 ? offset : null
  } catch {
    // private mode can throw on access alone: losing the offset is not an error
    return null
  }
}

function write(key: string, offset: number): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, String(offset))
  } catch {
    // quota or private mode; same reasoning as read()
  }
}

function maxOffset(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

/**
 * Restores the window offset of one history entry.
 *
 * react-router only restores scroll for routes whose data it loads itself; here
 * the list arrives from react-query after the route is already idle, so by the
 * time the router would scroll there is nothing tall enough to scroll to.
 *
 * @param key one history entry — `useLocation().key`, so a fresh visit starts
 *   at the top and only back/forward returns to where the user was.
 * @param ready true once the content that gives the page its height is on
 *   screen; the restore holds until then.
 */
export function useScrollRestoration(key: string, ready: boolean): void {
  // read before anything can overwrite it, and once per entry
  const [entry, setEntry] = useState(() => ({ key, offset: read(key) }))
  if (entry.key !== key) setEntry({ key, offset: read(key) })

  const restoredKey = useRef<string | null>(null)
  // the offset is sampled while the user scrolls, never read at teardown: by
  // then the next screen has already replaced this one and the browser has
  // clamped the offset to a page that is one card tall
  const latest = useRef({ offset: 0, max: 0 })

  useEffect(() => {
    if (!ready) return
    if (entry.offset === null) return
    if (restoredKey.current === entry.key) return

    const offset = entry.offset
    let frame = 0
    let frames = 0

    function attempt() {
      if (maxOffset() >= offset || frames >= MAX_FRAMES) {
        restoredKey.current = entry.key
        window.scrollTo({
          top: Math.min(offset, maxOffset()),
          behavior: 'auto',
        })
        return
      }
      frames += 1
      frame = requestAnimationFrame(attempt)
    }

    frame = requestAnimationFrame(attempt)
    return () => cancelAnimationFrame(frame)
  }, [entry, ready])

  useEffect(() => {
    let frame = 0

    function writable() {
      // an entry we came back to must not be overwritten by the 0 of its own
      // fresh mount: it only opens up once the restore has had its turn
      return entry.offset === null || restoredKey.current === entry.key
    }

    function flush() {
      frame = 0
      write(entry.key, latest.current.offset)
    }

    function onScroll() {
      if (!writable()) return
      const max = maxOffset()
      const offset = Math.round(window.scrollY)
      // the page shrank and dragged the offset down to its new bottom: that is
      // the browser clamping, not the user scrolling. keep what they chose
      const clamped = offset > 0 && max < latest.current.max && offset >= max
      if (!clamped) latest.current = { offset, max }
      if (frame === 0) frame = requestAnimationFrame(flush)
    }

    function save() {
      if (!writable()) return
      write(entry.key, latest.current.offset)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // leaving for the detail screen unmounts this; pagehide covers a reload or
    // a tab that goes away without one
    window.addEventListener('pagehide', save)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', save)
      if (frame !== 0) cancelAnimationFrame(frame)
      save()
    }
  }, [entry])
}
