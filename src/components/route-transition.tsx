import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type RouteTransitionProps = {
  children: ReactNode
}

// transição de rota via CSS animation + key no DOM.
// CSS puro evita o flash do AnimatePresence (inline style aplicado depois do paint).
export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation()

  return (
    <div key={location.pathname} className="route-transition">
      {children}
    </div>
  )
}
