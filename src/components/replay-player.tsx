import { VideoOff } from 'lucide-react'
import { useState } from 'react'

type ReplayPlayerProps = {
  src: string
  label: string
  className?: string
}

// controls nativos de propósito: o browser já entrega fullscreen, PiP, atalhos de
// teclado e legenda de acessibilidade — reimplementar isso só adiciona bug.
export function ReplayPlayer({ src, label, className }: ReplayPlayerProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-2 p-6 text-center text-sm">
        <VideoOff className="size-8" aria-hidden />
        <p>O arquivo deste replay não está disponível para reprodução.</p>
      </div>
    )
  }

  return (
    <video
      src={src}
      title={label}
      controls
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
