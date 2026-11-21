import { useState } from 'react'

import { Ilustracao } from '@/components/ilustracao'

type ReplayPlayerProps = {
  src: string
  label: string
  className?: string
}

// controls nativos de propósito: o browser já entrega fullscreen, PiP e atalhos
export function ReplayPlayer({ src, label, className }: ReplayPlayerProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-white/80">
        <Ilustracao nome="video-indisponivel" className="w-44 sm:w-52" />
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
