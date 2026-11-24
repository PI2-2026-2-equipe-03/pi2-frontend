import type { ReactNode, SVGProps } from 'react'

import { IconeGestor } from '@/components/repeteco-icons'
import {
  avatarDoUsuario,
  type AvatarNome,
  type UsuarioAvatar,
} from '@/lib/avatar'
import type { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'

function IconeCoroa(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M4 8l4 4 4-6 4 6 4-4-1.6 10H5.6z" />
    </svg>
  )
}

const PAPEIS: Partial<
  Record<
    UserRole,
    {
      rotulo: string
      Icone: (p: SVGProps<SVGSVGElement>) => ReactNode
      cor: string
    }
  >
> = {
  ADM: {
    rotulo: 'Administrador',
    Icone: IconeCoroa,
    cor: 'bg-tg-brand-yellow text-tg-brand-blue',
  },
  CLI: {
    rotulo: 'Gestor de arena',
    Icone: IconeGestor,
    cor: 'bg-tg-brand-blue text-white',
  },
}

type AvatarUsuarioProps = {
  // undefined enquanto o /me carrega: mostra um círculo neutro do mesmo tamanho
  usuario?: UsuarioAvatar | null
  // força um avatar (para quando o usuário puder escolher o seu)
  avatar?: AvatarNome
  // selo do papel no canto: coroa para administrador, escudo para gestor
  mostrarPapel?: boolean
  // vazio = decorativo (o nome já aparece ao lado)
  alt?: string
  className?: string
}

// o tamanho vem do className (size-8 no header, size-16 no perfil...).
export function AvatarUsuario({
  usuario,
  avatar,
  mostrarPapel = true,
  alt = '',
  className,
}: AvatarUsuarioProps) {
  if (!usuario) {
    return (
      <span
        aria-hidden
        className={cn(
          'inline-block size-8 shrink-0 rounded-full bg-current opacity-15',
          className,
        )}
      />
    )
  }

  const nome = avatar ?? avatarDoUsuario(usuario)
  const papel = mostrarPapel && usuario.role ? PAPEIS[usuario.role] : undefined

  return (
    <span
      className={cn('relative inline-flex size-8 shrink-0', className)}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
    >
      <img
        src={`/avatares/${nome}.svg`}
        alt=""
        aria-hidden
        width={256}
        height={256}
        decoding="async"
        draggable={false}
        className="size-full rounded-full select-none"
      />
      {papel ? (
        <span
          title={papel.rotulo}
          className={cn(
            'ring-background absolute -right-[6%] -bottom-[6%] flex size-[44%] items-center justify-center rounded-full ring-2',
            papel.cor,
          )}
        >
          <papel.Icone className="size-[68%]" />
          <span className="sr-only">{papel.rotulo}</span>
        </span>
      ) : null}
    </span>
  )
}
