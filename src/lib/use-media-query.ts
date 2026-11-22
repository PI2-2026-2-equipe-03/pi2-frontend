import { useEffect, useState } from 'react'

// md (48rem) is the line the listing toolbar already uses to swap its inline
// filters for a sheet; reusing it keeps one screen from mixing both idioms
export const DESKTOP_QUERY = '(min-width: 48rem)'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const list = window.matchMedia(query)
    // the first paint may have happened before this effect, so re-read instead
    // of trusting the initial state
    setMatches(list.matches)

    function onChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}
