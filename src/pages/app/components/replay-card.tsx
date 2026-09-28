import { Calendar, Download, MapPin, Play, Share2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Replay } from '@/lib/mocks'
import { ARENAS, SPORT_LABEL } from '@/lib/mocks'

type ReplayCardProps = {
  replay: Replay
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function ReplayCard({ replay }: ReplayCardProps) {
  const arena = ARENAS.find((a) => a.id === replay.arenaId)

  return (
    <Card className="group hover:border-tg-brand-blue/30 overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={replay.thumb}
          alt={`Thumbnail do replay ${replay.titulo}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <button
          type="button"
          aria-label={`Assistir ${replay.titulo}`}
          className="bg-tg-brand-blue/90 hover:bg-tg-brand-blue focus-visible:ring-ring/60 absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full text-white opacity-0 shadow-lg transition-opacity duration-300 focus-visible:opacity-100 focus-visible:ring-4 focus-visible:outline-none group-hover:opacity-100"
        >
          <Play className="size-6 fill-current" />
        </button>

        <Badge
          variant="secondary"
          className="bg-background/90 text-foreground absolute right-2 bottom-2 tabular-nums backdrop-blur"
        >
          {replay.duracao}
        </Badge>
        <Badge
          variant="brand"
          className="absolute top-2 left-2 backdrop-blur"
        >
          {SPORT_LABEL[replay.esporte]}
        </Badge>
      </div>

      <div className="space-y-2 p-4">
        <p className="text-foreground group-hover:text-tg-brand-blue font-semibold transition-colors">
          {replay.titulo}
        </p>
        <div className="text-muted-foreground flex flex-col gap-1 text-xs">
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {arena?.nome ?? 'Arena desconhecida'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {dateFormatter.format(new Date(replay.data))}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm">
            <Play className="size-3.5" />
            Ver
          </Button>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Baixar replay ${replay.titulo}`}
            >
              <Download className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Compartilhar replay ${replay.titulo}`}
            >
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
