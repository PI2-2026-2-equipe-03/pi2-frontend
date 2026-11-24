import { cn } from '@/lib/utils'

export type IlustracaoNome =
  | 'boas-vindas'
  | 'sem-replays'
  | 'busca-vazia'
  | 'sem-quadras'
  | 'sem-arenas'
  | 'sem-conexao'
  | 'bola-na-rede'
  | 'erro-servidor'
  | 'nao-encontrado'
  | 'video-indisponivel'
  | 'replay-expirado'
  | 'acesso-negado'
  | 'sem-patrocinadores'
  | 'email-enviado'
  | 'link-expirado'
  | 'sucesso'
  | 'sessao-expirada'
  | 'manutencao'
  | 'camera-offline'
  | 'notificacao'

type IlustracaoProps = {
  nome: IlustracaoNome
  className?: string
  // vazio = decorativa (o título ao lado já diz o que aconteceu)
  alt?: string
}

// ilustrações da marca em public/ilustracoes. o palco é azul nos dois temas, então
// não há versão clara/escura. a animação é css dentro do próprio svg e para
// sozinha com prefers-reduced-motion.
export function Ilustracao({ nome, className, alt = '' }: IlustracaoProps) {
  return (
    <img
      src={`/ilustracoes/${nome}.svg`}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={480}
      height={360}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn('pointer-events-none h-auto w-56 select-none', className)}
    />
  )
}
