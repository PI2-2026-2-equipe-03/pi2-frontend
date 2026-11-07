import { useState } from 'react'

import { MediaPlaceholder } from '@/components/media-placeholder'

type MediaThumbProps = {
  src: string | null
  alt: string
  kind: 'arena' | 'quadra'
  className?: string
  loading?: 'lazy' | 'eager'
}

// guarda qual src falhou pra não travar no placeholder quando chegar foto nova
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
