import { useMutation } from '@tanstack/react-query'
import {
  ArrowLeft,
  Calendar,
  Download,
  Loader2,
  MapPin,
  RefreshCw,
  VideoOff,
  WifiOff,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { EmptyState } from '@/components/empty-state'
import { ReplayExpiry } from '@/components/replay-expiry'
import { ReplayPlayer } from '@/components/replay-player'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { resolveMediaUrl } from '@/lib/api/mappers'
import { useReplays } from '@/lib/api/queries'
import { getReplayDownload } from '@/lib/api/replays'
import { getApiErrorMessage } from '@/lib/errors'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

// a tela cabe no slot que o AppLayout deixa: 4rem de header + o padding do main
// (p-4 no mobile, p-8 no md+). sem isso o conteúdo gera scroll de página.
// abaixo de 36rem de altura (celular deitado) travar a altura espremeria o
// player a ponto de esconder o botão de download: ali o scroll normal é melhor.
const SHELL =
  'mx-auto flex h-[calc(100svh-6rem)] w-full max-w-6xl flex-col gap-3 md:h-[calc(100svh-8rem)] md:gap-4 [@media(max-height:36rem)]:h-auto'

export function ReplayDetail() {
  const { id } = useParams<{ id: string }>()

  const replaysQuery = useReplays()
  const view = replaysQuery.data?.find((r) => r.id === id)

  const downloadMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Replay sem identificador')
      const response = await getReplayDownload(id)
      return resolveMediaUrl(response.data.downloadUrl)
    },
    onSuccess: (url) => {
      window.open(url, '_blank', 'noopener,noreferrer')
      toast.success('Download iniciado')
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, 'Não foi possível baixar o replay'),
        {
          action: {
            label: 'Tentar de novo',
            onClick: () => downloadMutation.mutate(),
          },
        },
      )
    },
  })

  const isLoading = replaysQuery.isPending
  const isError = replaysQuery.isError
  const notFound = !isLoading && !isError && !view
  const isDeleted = view?.status === 'deleted'

  return (
    <div className={SHELL}>
      <Button asChild variant="ghost" size="sm" className="shrink-0 self-start">
        <Link to="/app/replays">
          <ArrowLeft className="size-4" />
          Voltar para replays
        </Link>
      </Button>

      {isLoading ? (
        <Card className="shadow-card grid min-h-0 flex-1 grid-rows-[minmax(11rem,1fr)_auto] overflow-hidden rounded-2xl py-0 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-1">
          <Skeleton className="size-full rounded-none" />
          <div className="space-y-3 p-5 md:p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-40" />
          </div>
        </Card>
      ) : isError ? (
        <div className="grid min-h-0 flex-1 place-content-center">
          <EmptyState
            icon={WifiOff}
            title="Não foi possível carregar o replay"
            description="Confira se a API está no ar e tente novamente."
            action={
              <Button
                variant="brandOutline"
                onClick={() => void replaysQuery.refetch()}
                disabled={replaysQuery.isRefetching}
                aria-busy={replaysQuery.isRefetching}
              >
                <RefreshCw
                  className={`size-4 ${replaysQuery.isRefetching ? 'animate-spin' : ''}`}
                />
                Tentar novamente
              </Button>
            }
          />
        </div>
      ) : notFound ? (
        <div className="grid min-h-0 flex-1 place-content-center">
          <EmptyState
            icon={VideoOff}
            title="Replay não encontrado"
            description="O replay pode ter expirado ou sido removido."
            action={
              <Button asChild variant="brandOutline">
                <Link to="/app/replays">Voltar à lista</Link>
              </Button>
            }
          />
        </div>
      ) : view ? (
        <Card className="shadow-card grid min-h-0 flex-1 grid-rows-[minmax(11rem,1fr)_auto] overflow-hidden rounded-2xl py-0 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-1">
          <div className="relative min-h-0 overflow-hidden bg-black">
            <ReplayPlayer
              src={resolveMediaUrl(view.arquivoUrl)}
              label={`Replay de ${view.court.nome} — ${view.arena.nome}`}
              className="size-full object-contain"
            />
            {/* badges fora do caminho dos controls nativos (barra inferior) */}
            <ReplayExpiry
              expiresAt={view.expiresAt}
              className="pointer-events-none absolute top-3 left-3"
            />
            <span className="bg-background/90 text-foreground pointer-events-none absolute top-3 right-3 rounded-md px-2 py-0.5 text-xs tabular-nums backdrop-blur">
              {view.duration}s
            </span>
          </div>

          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-5 md:p-6">
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {view.arena.nome}
              </p>
              <h1 className="text-tg-brand-blue text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight font-bold">
                {view.court.nome}
              </h1>
            </div>

            <dl className="text-muted-foreground grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" aria-hidden />
                <dt className="sr-only">Cidade</dt>
                <dd>{view.city}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" aria-hidden />
                <dt className="sr-only">Data</dt>
                <dd>
                  {dateFormatter.format(new Date(view.recordedAt))} ·{' '}
                  {timeFormatter.format(new Date(view.recordedAt))}
                </dd>
              </div>
            </dl>

            {/* ação primária ancorada no fim da coluna em telas largas */}
            <div className="flex flex-col gap-2 lg:mt-auto">
              <Button
                variant="brand"
                className="w-full"
                disabled={downloadMutation.isPending || isDeleted}
                aria-busy={downloadMutation.isPending}
                onClick={() => downloadMutation.mutate()}
              >
                {downloadMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                Baixar replay
              </Button>
              {isDeleted ? (
                <p className="text-muted-foreground text-sm">
                  Este replay foi removido e não pode ser baixado.
                </p>
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
