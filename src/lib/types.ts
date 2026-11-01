// tipos alinhados ao MER do projeto (ver docs/design-de-sistema/modelo-entidade-relacionamento.md).
// nenhum campo é inventado — se não existe no banco, não existe aqui.

// o backend emite UUID em toda entidade — nada de id numérico no front.
export type Id = string

// códigos da tabela perfil, os mesmos que o backend usa para autorizar
export type UserRole = 'ADM' | 'CLI' | 'USR'

export type Arena = {
  id: Id
  clienteId: Id
  nome: string
  cidade: string
  endereco: string
  // nullable de propósito: o backend ainda não expõe upload e responde null.
  // quem renderiza decide o placeholder — a camada de dados não inventa foto.
  fotoUrl: string | null
}

export type Quadra = {
  id: Id
  arenaId: Id
  nome: string
  disponivel: boolean
}

export type CameraStatus = 'ativa' | 'inativa' | 'manutencao'

export type Camera = {
  id: Id
  quadraId: Id
  identificador: string
  status: CameraStatus
}

export type ReplayStatus = 'pending' | 'available' | 'deleted'

// entidade crua do replay (reflete a linha da tabela)
export type Replay = {
  id: Id
  courtId: Id
  arquivoUrl: string
  dataGeracao: string
  horaGeracao: string
  status: ReplayStatus
  criadoEm: string
  expiraEm: string
}

export type Patrocinador = {
  id: Id
  gestorId: Id
  nome: string
  fotoUrl: string
  duracao: number
  valor: number
}

// view-model da gestão: o patrocinador já com as quadras em que aparece.
// fotoUrl nullable porque a coluna foto_url aceita null no banco.
export type PatrocinadorView = Omit<Patrocinador, 'fotoUrl'> & {
  fotoUrl: string | null
  quadraIds: Id[]
}

export type QuadraPatrocinador = {
  quadraId: Id
  patrocinadorId: Id
}

// RF-05: cada replay tem exatamente 30 segundos
export const REPLAY_DURATION_SECONDS = 30 as const

// view-model consumido pelos componentes de UI — já carrega os joins necessários
// (quadra, arena, cidade, patrocinador ativo) para evitar lookups manuais nos cards.
export type ReplayView = {
  id: Id
  court: { id: Id; nome: string }
  // sem fotoUrl: a capa de um replay é um frame do próprio vídeo (arquivoUrl),
  // não a foto da arena.
  arena: { id: Id; nome: string }
  city: string
  recordedAt: string
  duration: typeof REPLAY_DURATION_SECONDS
  expiresAt: string
  status: ReplayStatus
  arquivoUrl: string
  sponsor?: { id: Id; nome: string; fotoUrl: string }
}
