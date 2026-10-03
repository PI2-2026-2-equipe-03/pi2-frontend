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

export function SponsorBadge({ nome, fotoUrl, className }: SponsorBadgeProps) {
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
          <img
            src={fotoUrl}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="left">Patrocínio · {nome}</TooltipContent>
    </Tooltip>
  )
}
