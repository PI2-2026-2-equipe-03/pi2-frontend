import { History } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { REPLAY_VIEWS } from '@/lib/mocks'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

export function RecentActivity() {
  const recentes = [...REPLAY_VIEWS]
    .sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
    )
    .slice(0, 5)

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
            <TableHead>Cidade</TableHead>
            <TableHead className="text-right">Duração</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentes.map((replay) => {
            const date = new Date(replay.recordedAt)
            return (
              <TableRow key={replay.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium">
                      {replay.court.nome}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {replay.arena.nome}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {replay.city}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {replay.duration}s
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {dateFormatter.format(date)} · {timeFormatter.format(date)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}
