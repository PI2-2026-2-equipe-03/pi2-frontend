import { useState } from 'react'

import { MediaPlaceholder } from '@/components/media-placeholder'

type MediaThumbProps = {
  src: string | null
  alt: string
  kind: 'arena' | 'quadra'
  className?: string
  loading?: 'lazy' | 'eager'
}

// url quebrada é tão comum quanto url ausente — guardar qual src falhou evita
// ficar preso no placeholder quando o componente recebe uma foto nova.
export function MediaThumb({
  src,
  alt,
  kind,
  className,
  loading = 'lazy',
}: MediaThumbProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || failedSrc === src) {
    return <MediaPlaceholder kind={kind} className={className} />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailedSrc(src)}
      className={className}
    />
  )
}
