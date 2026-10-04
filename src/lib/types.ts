// tipos alinhados ao MER do projeto (ver docs/design-de-sistema/modelo-entidade-relacionamento.md).
// nenhum campo é inventado — se não existe no banco, não existe aqui.

export type UserRole = 'USER' | 'MANAGER' | 'ADMIN'

export type Usuario = {
  id: number
  nome: string
  email: string
  telefone: string
  role: UserRole
  criadoEm: string
}

export type Arena = {
  id: number
  clienteId: number
  nome: string
  cidade: string
  endereco: string
  fotoUrl: string
}

export type Quadra = {
  id: number
  arenaId: number
  nome: string
  disponivel: boolean
}

export type ReplayStatus = 'pending' | 'available' | 'deleted'

// entidade crua do replay (reflete a linha da tabela)
export type Replay = {
  id: number
  courtId: number
  arquivoUrl: string
  dataGeracao: string
  horaGeracao: string
  status: ReplayStatus
  criadoEm: string
  expiraEm: string
}

export type Patrocinador = {
  id: number
  gestorId: number
  nome: string
  fotoUrl: string
  duracao: number
  valor: number
}

export type QuadraPatrocinador = {
  quadraId: number
  patrocinadorId: number
}

// RF-05: cada replay tem exatamente 30 segundos
export const REPLAY_DURATION_SECONDS = 30 as const

// view-model consumido pelos componentes de UI — já carrega os joins necessários
// (quadra, arena, cidade, patrocinador ativo) para evitar lookups manuais nos cards.
export type ReplayView = {
  id: number | string
  court: { id: number | string; nome: string }
  arena: { id: number | string; nome: string; fotoUrl: string }
  city: string
  recordedAt: string
  duration: typeof REPLAY_DURATION_SECONDS
  expiresAt: string
  status: ReplayStatus
  arquivoUrl: string
  sponsor?: { id: number; nome: string; fotoUrl: string }
}
