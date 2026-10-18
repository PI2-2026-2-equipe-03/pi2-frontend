import { useState } from 'react'

import { MediaPlaceholder } from '@/components/media-placeholder'

type ReplayThumbProps = {
  src: string
  className?: string
}

// a pré-visualização do replay é o próprio vídeo: preload=metadata baixa só o
// cabeçalho e o fragmento #t pinta um frame, sem puxar o arquivo inteiro.
// quando o backend expuser um poster gerado no upload, troca-se por <img>.
export function ReplayThumb({ src, className }: ReplayThumbProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <MediaPlaceholder kind="replay" className={className} />
  }

  return (
    <video
      src={`${src}#t=0.1`}
      preload="metadata"
      muted
      playsInline
      tabIndex={-1}
      aria-hidden
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
