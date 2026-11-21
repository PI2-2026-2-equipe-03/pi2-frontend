import { cn } from '@/lib/utils'

// loader da marca repeteco: o "e" se desenha, a seta estala e ele rebobina (gira -360°).
// usa currentColor -> controle a cor com text-* (ex.: text-tg-brand-yellow).
// respeita prefers-reduced-motion (vira um pulso suave).
const CSS = `.rp-g{transform-box:view-box;transform-origin:190px 190px;animation:rp-rew 1.8s infinite}
.rp-d{stroke-dasharray:630.1 640.1;animation:rp-draw 1.8s infinite}
.rp-a{transform-box:view-box;transform-origin:224.9px 251.8px;animation:rp-pop 1.8s infinite}
@keyframes rp-draw{0%{stroke-dashoffset:630.1;animation-timing-function:cubic-bezier(.65,0,.35,1)}40%,86%{stroke-dashoffset:0;animation-timing-function:cubic-bezier(.65,0,.35,1)}100%{stroke-dashoffset:-630.1}}
@keyframes rp-pop{0%,36%{transform:scale(0);animation-timing-function:cubic-bezier(.34,1.8,.64,1)}48%,86%{transform:scale(1);animation-timing-function:cubic-bezier(.65,0,.35,1)}100%{transform:scale(0)}}
@keyframes rp-rew{0%,48%{transform:rotate(0);animation-timing-function:cubic-bezier(.65,0,.35,1)}86%,100%{transform:rotate(-360deg)}}
@media (prefers-reduced-motion:reduce){.rp-g,.rp-d,.rp-a{animation:none}.rp-d{stroke-dashoffset:0}.rp-g{animation:rp-pulse 1.6s ease-in-out infinite}}
@keyframes rp-pulse{50%{opacity:.45}}`

type RepetecoLoaderProps = {
  className?: string
  /** texto lido por leitores de tela; vazio quando o contexto já anuncia (ex.: dentro de um toast) */
  label?: string
}

export function RepetecoLoader({
  className,
  label = 'Carregando',
}: RepetecoLoaderProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-live={label ? 'polite' : undefined}
      aria-hidden={label ? undefined : true}
      className={cn('inline-flex', className)}
    >
      <svg viewBox="0 0 380 380" className="size-full" aria-hidden="true">
        <style>{CSS}</style>
        <g className="rp-g">
          <path
            className="rp-d"
            transform="translate(192 190) scale(0.8)"
            d="M-87.50,0 L87.50,0 A87.5,87.5 0 1 0 41.08,77.26"
            fill="none"
            stroke="currentColor"
            strokeWidth={33}
            strokeLinejoin="miter"
          />
          <polygon
            className="rp-a"
            points="236.40,283.73 261.59,232.28 204.85,224.39"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={5.6}
            strokeLinejoin="round"
          />
        </g>
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  )
}
