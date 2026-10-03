import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type RouteTransitionProps = {
  children: ReactNode
}

// transição de rota via CSS animation + key no DOM.
// motivo: tentativas anteriores com framer-motion AnimatePresence causavam
// um "flash" perceptível — o novo conteúdo renderizava no estado final por 1-2
// frames antes do motion aplicar `initial` via inline style. CSS animation roda
// desde o paint inicial, sem depender de effects do React.
// o `key` força o React a remount o container inteiro quando a URL muda,
// disparando a animação naturalmente. respeita `prefers-reduced-motion` via
// a `@keyframes route-fade-in` em src/style.css.
export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation()

  return (
    <div key={location.pathname} className="route-transition">
      {children}
    </div>
  )
}
