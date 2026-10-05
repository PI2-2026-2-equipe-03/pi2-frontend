import { useMutation, useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Calendar,
  Download,
  Loader2,
  MapPin,
  VideoOff,
  WifiOff,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiErrorMessage } from '@/lib/api/errors'
import { resolveMediaUrl, toReplayView } from '@/lib/api/mappers'
import { getReplayDownload, listReplays } from '@/lib/api/replays'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

export function ReplayDetail() {
  const { id } = useParams<{ id: string }>()

  const replaysQuery = useQuery({
    queryKey: ['replays'],
    queryFn: listReplays,
  })

  const replay = replaysQuery.data?.data.find((r) => String(r.id) === id)
  const view = replay ? toReplayView(replay) : undefined

  const downloadMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Replay sem identificador')
      const response = await getReplayDownload(id)
      return {
        url: resolveMediaUrl(response.data.downloadUrl),
        fileName: response.data.fileName,
      }
    },
    onSuccess: (file) => {
      window.open(file.url, '_blank', 'noopener,noreferrer')
      toast.success('Download iniciado')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível baixar o replay'))
    },
  })

  const isLoading = replaysQuery.isPending
  const isError = replaysQuery.isError
  const notFound = !isLoading && !isError && !view
  const isDeleted = view?.status === 'deleted'

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="self-start">
        <Link to="/app/replays">
          <ArrowLeft className="size-4" />
          Voltar para replays
        </Link>
      </Button>

      {isLoading ? (
        <Card className="shadow-card overflow-hidden rounded-2xl py-0">
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-40" />
          </div>
        </Card>
      ) : isError ? (
        <EmptyState
          icon={WifiOff}
          title="Não foi possível carregar o replay"
          description="Confira se a API está no ar e tente novamente."
          action={
            <Button
              variant="brandOutline"
              onClick={() => void replaysQuery.refetch()}
            >
              Tentar novamente
            </Button>
          }
        />
      ) : notFound ? (
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
      ) : view ? (
        <Card className="shadow-card overflow-hidden rounded-2xl py-0">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={view.arena.fotoUrl}
              alt={`Pré-visualização do replay de ${view.arena.nome}`}
              loading="lazy"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="bg-background/90 text-foreground absolute right-3 bottom-3 rounded-md px-2 py-0.5 text-xs tabular-nums backdrop-blur">
              {view.duration}s
            </span>
          </div>

          <div className="space-y-4 p-6">
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {view.arena.nome}
              </p>
              <h1 className="text-tg-brand-blue text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold">
                {view.court.nome}
              </h1>
            </div>

            <dl className="text-muted-foreground grid gap-2 text-sm sm:grid-cols-2">
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

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
              <Button
                variant="brand"
                disabled={downloadMutation.isPending || isDeleted}
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
