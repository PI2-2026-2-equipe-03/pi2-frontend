import { useState } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type SponsorBadgeProps = {
  nome: string
  fotoUrl: string
  className?: string
}

// guarda qual src falhou pra tentar de novo quando o logo mudar
export function SponsorBadge({ nome, fotoUrl, className }: SponsorBadgeProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showFallback = !fotoUrl || failedSrc === fotoUrl

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'bg-background/90 ring-background/80 inline-flex size-9 items-center justify-center overflow-hidden rounded-full shadow-sm ring-2 backdrop-blur',
            className,
          )}
          aria-label={`Patrocínio: ${nome}`}
        >
          {showFallback ? (
            <span
              aria-hidden
              className="text-tg-brand-text text-sm font-semibold uppercase"
            >
              {nome.trim().charAt(0)}
            </span>
          ) : (
            <img
              src={fotoUrl}
              alt=""
              loading="lazy"
              onError={() => setFailedSrc(fotoUrl)}
              className="size-full object-cover"
            />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent side="left">Patrocínio · {nome}</TooltipContent>
    </Tooltip>
  )
}
