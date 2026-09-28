import { MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Arena } from '@/lib/mocks'
import { SPORT_LABEL } from '@/lib/mocks'

type ArenaCardProps = {
  arena: Arena
}

export function ArenaCard({ arena }: ArenaCardProps) {
  return (
    <Link
      to={`/app/quadras?arena=${arena.id}`}
      className="block focus-visible:outline-none"
    >
      <Card className="group hover:border-tg-brand-blue/30 focus-visible:ring-ring/40 h-full cursor-pointer overflow-hidden py-0 transition-all duration-300 group-focus-visible:ring-4 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-32 overflow-hidden">
          <img
            src={arena.cover}
            alt={`Foto da arena ${arena.nome}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <Badge
            variant="secondary"
            className="bg-background/90 text-tg-brand-blue-dark absolute top-2 right-2 backdrop-blur"
          >
            <Star className="fill-tg-brand-yellow text-tg-brand-yellow size-3" />
            {arena.nota}
          </Badge>
        </div>
        <div className="space-y-1.5 p-3">
          <p className="text-foreground group-hover:text-tg-brand-blue font-semibold transition-colors">
            {arena.nome}
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <MapPin className="size-3" />
            {arena.distancia} • {arena.cidade}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="outline" className="text-2xs">
              {arena.quadras} quadras
            </Badge>
            {arena.esportes.map((esporte) => (
              <Badge key={esporte} variant="outline" className="text-2xs">
                {SPORT_LABEL[esporte]}
              </Badge>
            ))}
            <Badge variant="outline" className="text-2xs">
              {arena.extra}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  )
}
