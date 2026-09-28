import { History } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ARENAS, QUADRAS, REPLAYS, SPORT_LABEL } from '@/lib/mocks'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

export function RecentActivity() {
  const recentes = REPLAYS.slice(0, 5)

  return (
    <section className="bg-card border-border rounded-xl border p-5 md:p-6">
      <header className="mb-4">
        <h2 className="text-tg-brand-blue flex items-center gap-2 text-lg font-bold">
          <History className="size-5" />
          Atividade recente
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Últimos replays gerados no sistema.
        </p>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quadra</TableHead>
            <TableHead>Esporte</TableHead>
            <TableHead className="text-right">Duração</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentes.map((replay) => {
            const quadra = QUADRAS.find((q) => q.id === replay.quadraId)
            const arena = ARENAS.find((a) => a.id === replay.arenaId)
            return (
              <TableRow key={replay.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium">
                      {quadra?.nome ?? '—'}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {arena?.nome ?? '—'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {SPORT_LABEL[replay.esporte]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {replay.duracao}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {dateFormatter.format(new Date(replay.data))}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}
