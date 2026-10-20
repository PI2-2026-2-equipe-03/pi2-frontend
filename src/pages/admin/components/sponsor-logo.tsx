import { useState } from 'react'

import { cn } from '@/lib/utils'

type SponsorLogoProps = {
  nome: string
  fotoUrl: string | null
  className?: string
}

function initials(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

// os logos do seed apontam para example.com, então url quebrada é o caso
// comum: cai nas iniciais locais em vez do ícone de imagem quebrada.
export function SponsorLogo({ nome, fotoUrl, className }: SponsorLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = fotoUrl && failedSrc !== fotoUrl

  return (
    <span
      className={cn(
        'bg-tg-brand-yellow/20 text-tg-brand-blue inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold',
        className,
      )}
    >
      {showImage ? (
        <img
          src={fotoUrl}
          alt=""
          loading="lazy"
          onError={() => setFailedSrc(fotoUrl)}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials(nome)}</span>
      )}
    </span>
  )
}
