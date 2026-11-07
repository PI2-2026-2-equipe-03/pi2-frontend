import { Clapperboard, LayoutGrid, MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'

const ICONS = {
  arena: MapPin,
  quadra: LayoutGrid,
  replay: Clapperboard,
} as const

type MediaPlaceholderProps = {
  kind: keyof typeof ICONS
  className?: string
}

// placeholder local e vetorial, sem rede e sem licença
export function MediaPlaceholder({ kind, className }: MediaPlaceholderProps) {
  const Icon = ICONS[kind]

  return (
    <div
      aria-hidden
      className={cn(
        'from-muted to-muted/40 text-muted-foreground/35 flex size-full items-center justify-center bg-gradient-to-br',
        className,
      )}
    >
      <Icon className="size-[26%] max-h-14 min-h-4 max-w-14 min-w-4" />
    </div>
  )
}
