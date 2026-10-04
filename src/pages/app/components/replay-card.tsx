import { useMutation } from '@tanstack/react-query'
import { Calendar, Download, Loader2, MapPin, Play, Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { ReplayExpiry } from '@/components/replay-expiry'
import { SponsorBadge } from '@/components/sponsor-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getApiErrorMessage } from '@/lib/api/errors'
import { resolveMediaUrl } from '@/lib/api/mappers'
import { getReplayDownload } from '@/lib/api/replays'
import type { ReplayView } from '@/lib/types'

type ReplayCardProps = {
  replay: ReplayView
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  anchor.target = '_blank'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export function ReplayCard({ replay }: ReplayCardProps) {
  const recorded = new Date(replay.recordedAt)
  const title = `${replay.arena.nome} · ${replay.court.nome}`
  const watchUrl = resolveMediaUrl(replay.arquivoUrl)

  const downloadMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await getReplayDownload(replay.id)
        return {
          url: resolveMediaUrl(response.data.downloadUrl),
          fileName: response.data.fileName,
        }
      } catch (error) {
        // backend atual só aceita id numérico no /download; usa o url da listagem
        if (replay.arquivoUrl) {
          return {
            url: resolveMediaUrl(replay.arquivoUrl),
            fileName: `replay-${replay.id}.mp4`,
          }
        }
        throw error
      }
    },
    onSuccess: (file) => {
      triggerDownload(file.url, file.fileName)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Não foi possível baixar o replay'))
    },
  })

  function handleWatch() {
    if (!watchUrl) {
      toast.error('Este replay ainda não tem arquivo disponível.')
      return
    }
    window.open(watchUrl, '_blank', 'noopener,noreferrer')
  }

  function handleShare() {
    const shareUrl = watchUrl || window.location.href
    void navigator.clipboard.writeText(shareUrl).then(
      () => toast.success('Link copiado'),
      () => toast.error('Não foi possível copiar o link'),
    )
  }

  return (
    <Card className="group border-border/60 shadow-card hover:border-tg-brand-blue/40 hover:shadow-card-hover overflow-hidden rounded-2xl py-0 transition-all duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={replay.arena.fotoUrl}
          alt={`Pré-visualização do replay de ${title}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <button
          type="button"
          aria-label={`Assistir replay de ${title}`}
          onClick={handleWatch}
          className="bg-tg-brand-blue/90 hover:bg-tg-brand-blue focus-visible:ring-ring/60 absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full text-white opacity-0 shadow-lg transition-opacity duration-300 focus-visible:opacity-100 focus-visible:ring-4 focus-visible:outline-none group-hover:opacity-100"
        >
          <Play className="size-6 fill-current" />
        </button>

        <span className="bg-background/90 text-foreground absolute right-2 bottom-2 rounded-md px-2 py-0.5 text-xs tabular-nums backdrop-blur">
          {replay.duration}s
        </span>

        {replay.sponsor ? (
          <SponsorBadge
            nome={replay.sponsor.nome}
            fotoUrl={replay.sponsor.fotoUrl}
            className="absolute top-2 right-2"
          />
        ) : null}

        <div className="absolute top-2 left-2">
          <ReplayExpiry expiresAt={replay.expiresAt} />
        </div>
      </div>

      <div className="space-y-2 p-4">
        <p className="text-foreground group-hover:text-tg-brand-blue line-clamp-1 font-semibold tracking-tight transition-colors">
          {title}
        </p>
        <div className="text-muted-foreground flex flex-col gap-1 text-xs">
          <span className="flex items-center gap-1">
            <MapPin className="size-3 shrink-0" />
            <span className="line-clamp-1">{replay.city}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3 shrink-0" />
            {dateFormatter.format(recorded)} · {timeFormatter.format(recorded)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={handleWatch}>
            <Play className="size-3.5" />
            Ver
          </Button>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Baixar replay de ${title}`}
              disabled={downloadMutation.isPending}
              onClick={() => downloadMutation.mutate()}
            >
              {downloadMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Compartilhar replay de ${title}`}
              onClick={handleShare}
            >
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
