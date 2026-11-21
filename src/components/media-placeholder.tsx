import { cn } from '@/lib/utils'

type MediaPlaceholderProps = {
  kind: 'arena' | 'quadra' | 'replay'
  className?: string
}

// capa da marca quando a mídia não existe ou falhou: svg local, sem rede e sem licença
export function MediaPlaceholder({ kind, className }: MediaPlaceholderProps) {
  return (
    <img
      src={`/ilustracoes/capas/capa-${kind}.svg`}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn('bg-tg-brand-blue size-full object-cover', className)}
    />
  )
}
