import { motion } from 'framer-motion'
import { ChevronRight, LayoutGrid, MapPin } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Quadra } from '@/lib/mocks'
import { ARENAS, QUADRAS, REPLAYS, SPORT_LABEL } from '@/lib/mocks'
import { motionTokens } from '@/lib/motion'

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.durations.base,
      ease: motionTokens.ease.out,
    },
  },
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

function QuadraCard({ quadra }: { quadra: Quadra }) {
  const arena = ARENAS.find((a) => a.id === quadra.arenaId)
  const replaysDaQuadra = REPLAYS.filter((r) => r.quadraId === quadra.id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          role="button"
          tabIndex={0}
          className="group hover:border-tg-brand-blue/30 focus-visible:ring-ring/40 cursor-pointer overflow-hidden py-0 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-4 focus-visible:outline-none"
        >
          <div className="relative h-24 overflow-hidden">
            <img
              src={quadra.cover}
              alt={`Foto da ${quadra.nome}`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <Badge
              variant={quadra.status === 'online' ? 'success' : 'destructive'}
              className="absolute top-2 right-2 backdrop-blur"
            >
              {quadra.status === 'online' ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="space-y-1 p-3">
            <p className="text-foreground group-hover:text-tg-brand-blue font-semibold transition-colors">
              {quadra.nome}
            </p>
            <p className="text-muted-foreground text-xs">
              {quadra.piso} · {SPORT_LABEL[quadra.esporte]}
            </p>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{quadra.nome}</DialogTitle>
          <DialogDescription>
            {arena?.nome ?? 'Arena desconhecida'} · {quadra.piso} ·{' '}
            {SPORT_LABEL[quadra.esporte]}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm font-medium">
            Últimos replays
          </p>
          {replaysDaQuadra.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Ainda não há replays gravados nesta quadra.
            </p>
          ) : (
            <ul className="flex gap-3 overflow-x-auto pb-1">
              {replaysDaQuadra.slice(0, 3).map((replay) => (
                <li key={replay.id} className="min-w-52 shrink-0">
                  <div className="relative aspect-video overflow-hidden rounded-md">
                    <img
                      src={replay.thumb}
                      alt=""
                      className="size-full object-cover"
                    />
                    <span className="bg-background/90 text-foreground absolute right-1.5 bottom-1.5 rounded-md px-1.5 py-0.5 text-xs tabular-nums backdrop-blur">
                      {replay.duracao}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-sm font-medium">
                    {replay.titulo}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {dateFormatter.format(new Date(replay.data))}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <Button asChild variant="brandOutline" className="mt-2 self-start">
            <Link to={`/app/replays?q=${encodeURIComponent(quadra.nome)}`}>
              Ver todos os replays desta quadra
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function Quadras() {
  const [arenaId] = useQueryState('arena', { defaultValue: '' })

  const arenaSelecionada = useMemo(
    () => (arenaId ? ARENAS.find((a) => a.id === arenaId) : undefined),
    [arenaId],
  )

  const quadrasVisiveis = useMemo(
    () =>
      arenaSelecionada
        ? QUADRAS.filter((q) => q.arenaId === arenaSelecionada.id)
        : QUADRAS,
    [arenaSelecionada],
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        {arenaSelecionada ? (
          <nav
            aria-label="breadcrumb"
            className="text-muted-foreground flex items-center gap-1 text-xs"
          >
            <Link to="/app" className="hover:text-foreground">
              Início
            </Link>
            <ChevronRight className="size-3" />
            <Link to="/app/arenas" className="hover:text-foreground">
              Arenas
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">
              {arenaSelecionada.nome}
            </span>
          </nav>
        ) : null}

        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
              {arenaSelecionada
                ? `Quadras de ${arenaSelecionada.nome}`
                : 'Todas as quadras'}
            </h1>
            {arenaSelecionada ? (
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin className="size-3" />
                {arenaSelecionada.cidade}
              </p>
            ) : (
              <p className="text-tg-brand-blue font-medium">
                Escolha uma quadra para ver seus replays.
              </p>
            )}
          </div>
          <Badge variant="outline" className="tabular-nums">
            {quadrasVisiveis.length}{' '}
            {quadrasVisiveis.length === 1 ? 'quadra' : 'quadras'}
          </Badge>
        </div>
      </header>

      {quadrasVisiveis.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Sem quadras cadastradas"
          description="Esta arena ainda não tem quadras vinculadas."
          action={
            <Button asChild variant="brandOutline">
              <Link to="/app/arenas">Voltar às arenas</Link>
            </Button>
          }
        />
      ) : (
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {quadrasVisiveis.map((quadra) => (
            <motion.li key={quadra.id} variants={itemVariants}>
              <QuadraCard quadra={quadra} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
