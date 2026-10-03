import { LayoutGrid, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { QUADRAS } from '@/lib/mocks'
import type { Arena } from '@/lib/types'

type ArenaCardProps = {
  arena: Arena
}

export function ArenaCard({ arena }: ArenaCardProps) {
  // projeção da UI: contagem de quadras por arena. não é campo da entidade;
  // no dia que o backend expuser GET /arenas com quadrasCount embutido, troca
  // essa linha pela propriedade do payload.
  const quadrasCount = QUADRAS.filter((q) => q.arenaId === arena.id).length

  return (
    <Link
      to={`/app/quadras?arena=${arena.id}&from=arena`}
      className="block focus-visible:outline-none"
    >
      <Card className="group border-border/60 shadow-card hover:border-tg-brand-blue/40 hover:shadow-card-hover focus-visible:ring-ring/40 h-full cursor-pointer overflow-hidden rounded-2xl py-0 transition-all duration-200 group-focus-visible:ring-4 hover:-translate-y-0.5">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={arena.fotoUrl}
            alt={`Foto da arena ${arena.nome}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          {quadrasCount > 0 ? (
            <span className="bg-background/90 text-foreground absolute top-2 right-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums backdrop-blur">
              <LayoutGrid className="size-3" aria-hidden />
              {quadrasCount} {quadrasCount === 1 ? 'quadra' : 'quadras'}
            </span>
          ) : null}
        </div>
        <div className="space-y-1.5 p-4">
          <p className="text-foreground group-hover:text-tg-brand-blue text-base font-semibold tracking-tight transition-colors">
            {arena.nome}
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs leading-relaxed">
            <MapPin className="size-3 shrink-0" />
            <span className="line-clamp-1">
              {arena.cidade} · {arena.endereco}
            </span>
          </p>
        </div>
      </Card>
    </Link>
  )
}
