import { MapPin, Search, Star, Video } from 'lucide-react'

import { Input } from '@/components/ui/input'

// mock local — sem dados dinâmicos por enquanto (issue #18)
const ARENAS_FAVORITAS = [
  {
    nome: 'Reriutaba Vôlei',
    cidade: 'Barra da Tijuca, RJ',
    distancia: '2.000 km',
    nota: 4.6,
    quadras: 4,
    extra: 'Parking',
  },
  {
    nome: 'Vila - Sport',
    cidade: 'Crateús, CE',
    distancia: '2 km',
    nota: 4.9,
    quadras: 4,
    extra: 'Parking',
  },
  {
    nome: 'Arena Charito',
    cidade: 'Ipueiras, CE',
    distancia: '40 km',
    nota: 4.8,
    quadras: 6,
    extra: 'Lighting',
  },
]

// tela início — "selecione a arena" (fluxo cliente, item 2 do docs/fluxo-navegacao.md)
export function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header>
        <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
          Selecione a arena
        </h1>
        <p className="text-tg-brand-blue font-medium">
          Reviva seus melhores momentos.
        </p>
      </header>

      <div className="flex justify-center">
        <Video className="text-tg-brand-blue-dark size-24" />
      </div>

      <div className="flex justify-center">
        <div className="border-border bg-background flex w-full max-w-xl items-center gap-2 rounded-full border px-4 py-2 shadow-sm">
          <Search className="text-muted-foreground size-4" />
          <Input
            type="search"
            placeholder="Qual cidade você está buscando?"
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <section>
        <h2 className="text-tg-brand-blue mb-3 text-lg font-bold">
          Arenas favoritas
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARENAS_FAVORITAS.map((arena) => (
            <li
              key={arena.nome}
              className="bg-card border-border overflow-hidden rounded-xl border"
            >
              <div className="bg-muted relative h-28">
                <span className="text-tg-brand-blue-dark absolute top-2 right-2 flex items-center gap-1 rounded bg-white/90 px-2 py-0.5 text-xs font-semibold">
                  <Star className="size-3" />
                  {arena.nota}
                </span>
              </div>
              <div className="space-y-1 p-3">
                <p className="text-foreground font-semibold">{arena.nome}</p>
                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                  <MapPin className="size-3" />
                  {arena.distancia} • {arena.cidade}
                </p>
                <div className="flex gap-2 pt-1">
                  <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                    {arena.quadras} Courts
                  </span>
                  <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                    {arena.extra}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
