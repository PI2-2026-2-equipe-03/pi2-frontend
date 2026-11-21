// Ícones repeteco: traço 2px, 24x24, herdam a cor via currentColor.
// Gerado automaticamente (marca/icones). Uso: <IconeReplay className="size-5 text-primary" />
import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

function Base({
  title,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function IconeReplay(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 12h14A7 7 0 1 0 15.29 18.18" />
      <path d="M14.48 21.78L16.70 17.43L11.85 16.84" />
    </Base>
  )
}

export function IconeBotao(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4.5" y="3" width="15" height="9" rx="2.5" />
      <ellipse cx="12" cy="6.6" rx="4" ry="1.5" />
      <path d="M8 6.6v1.6c0 .9 1.8 1.5 4 1.5s4-.6 4-1.5V6.6" />
      <path d="M12 12v8M8.5 21h7" />
    </Base>
  )
}

export function IconeClique(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10 10l9.5 3.8-4 1.5-1.6 4.2z" />
      <path d="M6.4 9.2a4 4 0 0 1 2.8-2.8" />
      <path d="M3.6 9a6.8 6.8 0 0 1 5.4-5.4" />
    </Base>
  )
}

export function IconeClipe(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 9h18M3 15h18M7.5 5v4M12 5v4M16.5 5v4M7.5 15v4M12 15v4M16.5 15v4" />
    </Base>
  )
}

export function IconeCronometro30s(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M10 2.5h4M12 2.5V6M18.5 6.5l1.4-1.4" />
      <path d="M12 13.5V9.5" />
      <path d="M12 13.5l2.8 2" />
    </Base>
  )
}

export function IconeCamera(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="2.5" y="6.5" width="13" height="11" rx="2.5" />
      <path d="M15.5 10.5l5-3v9l-5-3" />
      <circle cx="6.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
    </Base>
  )
}

export function IconeQuadra(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M12 5v14" />
      <path d="M7.5 9v6M16.5 9v6" strokeWidth="1.3" />
    </Base>
  )
}

export function IconeRede(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 20V5M20 20V5M4 6.5h16M4 13h16" />
      <path
        d="M4 9.75h16M7.2 6.5v6.5M10.4 6.5v6.5M13.6 6.5v6.5M16.8 6.5v6.5"
        strokeWidth="1.2"
      />
    </Base>
  )
}

export function IconeBola(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12A9 9 0 0 1 12 3" />
      <path d="M12 12A9 9 0 0 1 19.79 16.5" />
      <path d="M12 12A9 9 0 0 1 4.21 16.5" />
    </Base>
  )
}

export function IconeAreia(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="17" cy="6.5" r="2.5" />
      <path d="M3 14c3-2 6 2 9 0s6-2 9 0" />
      <path d="M3 18.5c3-2 6 2 9 0s6-2 9 0" />
    </Base>
  )
}

export function IconeCelular(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
      <path d="M10.5 8.2v5l4-2.5z" />
    </Base>
  )
}

export function IconeDownload(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.5v11M7 10l5 5 5-5M5 20.5h14" />
    </Base>
  )
}

export function IconePlay(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z" />
    </Base>
  )
}

export function IconeArena(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21.5s7-6.3 7-11.8a7 7 0 0 0-14 0c0 5.5 7 11.8 7 11.8z" />
      <circle cx="12" cy="9.7" r="2.7" />
    </Base>
  )
}

export function IconePatrocinador(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.6 14l-1.4 7 4.8-2.4 4.8 2.4-1.4-7" />
      <path
        d="M12 5.9l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z"
        fill="currentColor"
        stroke="none"
      />
    </Base>
  )
}

export function IconeExpira(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 3h12M6 21h12" />
      <path d="M7.5 3c0 5 4.5 6 4.5 9s-4.5 4-4.5 9M16.5 3c0 5-4.5 6-4.5 9s4.5 4 4.5 9" />
      <path d="M9.5 18.5h5" strokeWidth="1.5" />
    </Base>
  )
}

export function IconeGestor(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.8l7 3v5.4c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V5.8z" />
      <path d="M8.8 12l2.2 2.2 4.2-4.4" />
    </Base>
  )
}

export function IconeLance(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M13.5 2.5L4.5 14h7l-1 7.5 9-11.5h-7z" />
    </Base>
  )
}

export function IconeCompartilhar(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1" />
    </Base>
  )
}

export function IconeGaleria(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
      <path d="M6.2 5.5v3l2.4-1.5z" fill="currentColor" />
    </Base>
  )
}

export function IconeGravando(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </Base>
  )
}

export function IconeApito(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 9h11a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1h-6.03A5 5 0 1 1 9 9z" />
      <circle cx="9" cy="14" r="1.5" />
      <path d="M17.5 6.2l1-2M20.6 6.8l1.4-1.2" strokeWidth="1.6" />
    </Base>
  )
}

export function IconeTrofeu(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 3.5h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 5.2H5.6a2.6 2.6 0 0 0 2.7 4.3M16 5.2h2.4a2.6 2.6 0 0 1-2.7 4.3" />
      <path d="M12 12.5v4" />
      <path d="M8 20.5h8" />
      <path d="M9.5 20.5c0-2.3 1.1-4 2.5-4s2.5 1.7 2.5 4" />
    </Base>
  )
}

export function IconeWifiQuadra(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a5.6 5.6 0 0 1 8 0" />
      <circle cx="12" cy="18.6" r="1.2" fill="currentColor" />
      <path d="M2 9a15 15 0 0 1 20 0" />
    </Base>
  )
}

export function IconeSucesso(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.3l2.7 2.7L16.2 9.4" />
    </Base>
  )
}

export function IconeErro(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </Base>
  )
}

export function IconeAviso(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10.3 4.2a2 2 0 0 1 3.4 0l7.4 12.9a2 2 0 0 1-1.7 3H4.6a2 2 0 0 1-1.7-3z" />
      <path d="M12 9.5v4" />
      <circle cx="12" cy="16.8" r=".6" fill="currentColor" />
    </Base>
  )
}

export function IconeInfo(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r=".6" fill="currentColor" />
    </Base>
  )
}

export function IconeNotificacao(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 16.5V11a6 6 0 0 1 7.55-5.8M17.91 9.96A6 6 0 0 1 18 11v5.5l1.5 2h-15l1.5-2" />
      <path d="M10 21h4" />
      <circle cx="18.5" cy="5.5" r="2.5" fill="currentColor" stroke="none" />
    </Base>
  )
}

export function IconeSemVideo(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M11 6.5h2a2.5 2.5 0 0 1 2.5 2.5v2" />
      <path d="M13 17.5H5a2.5 2.5 0 0 1-2.5-2.5V9" />
      <path d="M15.5 10.5l5-3v7" />
      <path d="M3 3l18 18" />
    </Base>
  )
}

export function IconeSemConexao(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8.5 15.9a5 5 0 0 1 5.3-1.1" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
      <path d="M5 12.5a10 10 0 0 1 1.6-1.2M14.6 10a10 10 0 0 1 4.4 2.5" />
      <path d="M2 9a15 15 0 0 1 2.5-1.8M10.6 4.6A15 15 0 0 1 22 9" />
      <path d="M3 3l18 18" />
    </Base>
  )
}

export function IconeBloqueado(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 14.5v2.5" />
    </Base>
  )
}

export function IconeBusca(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5l5 5" />
    </Base>
  )
}
