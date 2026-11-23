// mocks locais, shapes alinhados ao MER (ver src/lib/types.ts)
import { ARENA_COVERS } from '@/lib/assets'
import { addDays, RETENTION_DAYS, retentionWindow } from '@/lib/dates'
import type {
  Arena,
  Camera,
  Id,
  Patrocinador,
  Quadra,
  QuadraPatrocinador,
  Replay,
  ReplayView,
} from '@/lib/types'
import { REPLAY_DURATION_SECONDS } from '@/lib/types'

const EXPIRY_WINDOW_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000

function plus7days(iso: string): string {
  const t = new Date(iso).getTime() + EXPIRY_WINDOW_MS
  return new Date(t).toISOString()
}

export const ARENAS: readonly Arena[] = [
  {
    id: '1',
    clienteId: '101',
    nome: 'Reriutaba Vôlei',
    cidade: 'Barra da Tijuca, RJ',
    endereco: 'Av. das Américas, 2300',
    fotoUrl: ARENA_COVERS.beachVolley1,
  },
  {
    id: '2',
    clienteId: '102',
    nome: 'Vila Sport',
    cidade: 'Crateús, CE',
    endereco: 'Rua Cel. Zezé, 410',
    fotoUrl: ARENA_COVERS.volleyIndoor,
  },
  {
    id: '3',
    clienteId: '103',
    nome: 'Arena Charito',
    cidade: 'Ipueiras, CE',
    endereco: 'Rod. CE-187, km 12',
    fotoUrl: ARENA_COVERS.tennisCourt,
  },
  {
    id: '4',
    clienteId: '104',
    nome: 'Campo Central',
    cidade: 'Sobral, CE',
    endereco: 'Av. Dom José, 2100',
    fotoUrl: ARENA_COVERS.soccerAction,
  },
  {
    id: '5',
    clienteId: '105',
    nome: 'Padel Club Fortaleza',
    cidade: 'Fortaleza, CE',
    endereco: 'Rua Osvaldo Cruz, 500',
    fotoUrl: ARENA_COVERS.padel,
  },
  {
    id: '6',
    clienteId: '106',
    nome: 'Quintal do Tênis',
    cidade: 'Tianguá, CE',
    endereco: 'Rua Monsenhor Rino, 88',
    fotoUrl: ARENA_COVERS.tennisAction,
  },
  {
    id: '7',
    clienteId: '107',
    nome: 'Arena Praia',
    cidade: 'Jericoacoara, CE',
    endereco: 'Rua Principal, s/n',
    fotoUrl: ARENA_COVERS.soccerBalls,
  },
  {
    id: '8',
    clienteId: '108',
    nome: 'Centro de Treinamento',
    cidade: 'Sobral, CE',
    endereco: 'Av. Perimetral, 900',
    fotoUrl: ARENA_COVERS.soccerTraining,
  },
] as const

export const QUADRAS: readonly Quadra[] = [
  { id: '101', arenaId: '1', nome: 'Quadra 01', disponivel: true },
  { id: '102', arenaId: '1', nome: 'Quadra 02', disponivel: true },
  { id: '103', arenaId: '2', nome: 'Quadra Coberta A', disponivel: true },
  { id: '104', arenaId: '2', nome: 'Quadra Coberta B', disponivel: false },
  { id: '105', arenaId: '3', nome: 'Quadra 01', disponivel: true },
  { id: '106', arenaId: '3', nome: 'Quadra 02', disponivel: true },
  { id: '107', arenaId: '4', nome: 'Principal', disponivel: true },
  { id: '108', arenaId: '5', nome: 'Padel 01', disponivel: true },
  { id: '109', arenaId: '5', nome: 'Padel 02', disponivel: false },
] as const

// uma câmera por quadra, como no seed do backend. a 109 fica sem câmera de
// propósito, para a gestão exibir o caso "sem câmera".
export const CAMERAS: readonly Camera[] = [
  { id: '501', quadraId: '101', identificador: 'CAM-RER-01', status: 'ativa' },
  { id: '502', quadraId: '102', identificador: 'CAM-RER-02', status: 'ativa' },
  { id: '503', quadraId: '103', identificador: 'CAM-VILA-A', status: 'ativa' },
  {
    id: '504',
    quadraId: '104',
    identificador: 'CAM-VILA-B',
    status: 'inativa',
  },
  { id: '505', quadraId: '105', identificador: 'CAM-CHA-01', status: 'ativa' },
  {
    id: '506',
    quadraId: '106',
    identificador: 'CAM-CHA-02',
    status: 'manutencao',
  },
  { id: '507', quadraId: '107', identificador: 'CAM-CEN-01', status: 'ativa' },
  { id: '508', quadraId: '108', identificador: 'CAM-PAD-01', status: 'ativa' },
] as const

export const PATROCINADORES: readonly Patrocinador[] = [
  {
    id: '1',
    gestorId: '101',
    nome: 'Posto do Zé',
    fotoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=PZ&radius=50',
    duracao: 10,
    valor: 500,
  },
  {
    id: '2',
    gestorId: '102',
    nome: 'Beats Esporte',
    fotoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=BE&radius=50',
    duracao: 10,
    valor: 650,
  },
  {
    id: '3',
    gestorId: '103',
    nome: 'Charito Café',
    fotoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=CC&radius=50',
    duracao: 10,
    valor: 420,
  },
  {
    id: '4',
    gestorId: '105',
    nome: 'Padel Pro Shop',
    fotoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=PP&radius=50',
    duracao: 10,
    valor: 800,
  },
] as const

export const QUADRA_PATROCINADORES: readonly QuadraPatrocinador[] = [
  { quadraId: '101', patrocinadorId: '1' },
  { quadraId: '102', patrocinadorId: '1' },
  { quadraId: '103', patrocinadorId: '2' },
  { quadraId: '104', patrocinadorId: '2' },
  { quadraId: '105', patrocinadorId: '3' },
  { quadraId: '108', patrocinadorId: '4' },
] as const

// seeds are placed relative to today through dates.ts, the same functions the
// filter uses, so the mock cannot drift from the retention window (rn-01).
// hours are local on purpose: 22:30 in brasília is already the next day in
// utc, which is the case localDateKey exists to protect
const MOCK_NOW = Date.now()
const TODAY = retentionWindow(new Date(MOCK_NOW)).end

function seedTime(daysAgo: number, hour: number, minute: number): string {
  const at = addDays(TODAY, -daysAgo)
  at.setHours(hour, minute, 0, 0)
  // never in the future when the day is still going
  const latest = Math.max(TODAY.getTime(), MOCK_NOW - 60_000)
  return new Date(Math.min(at.getTime(), latest)).toISOString()
}

// two seeds sit past the window on purpose, so the date filter has something
// to hide; the 22:30 one is the timezone edge case
const REPLAY_SEEDS: ReadonlyArray<{
  id: Id
  courtId: Id
  recordedAt: string
}> = [
  { id: '1001', courtId: '101', recordedAt: seedTime(0, 18, 30) },
  { id: '1002', courtId: '103', recordedAt: seedTime(1, 20, 15) },
  { id: '1003', courtId: '105', recordedAt: seedTime(2, 17, 0) },
  { id: '1004', courtId: '107', recordedAt: seedTime(3, 19, 45) },
  { id: '1005', courtId: '108', recordedAt: seedTime(4, 22, 30) },
  {
    id: '1006',
    courtId: '102',
    recordedAt: seedTime(RETENTION_DAYS - 1, 16, 0),
  },
  { id: '1007', courtId: '104', recordedAt: seedTime(RETENTION_DAYS, 18, 0) },
  {
    id: '1008',
    courtId: '106',
    recordedAt: seedTime(RETENTION_DAYS + 2, 20, 0),
  },
]

export const REPLAYS: readonly Replay[] = REPLAY_SEEDS.map((seed) => {
  const date = new Date(seed.recordedAt)
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mi = String(date.getUTCMinutes()).padStart(2, '0')
  const ss = String(date.getUTCSeconds()).padStart(2, '0')
  return {
    id: seed.id,
    courtId: seed.courtId,
    arquivoUrl: `/replays/${seed.id}/stream`,
    dataGeracao: `${yyyy}-${mm}-${dd}`,
    horaGeracao: `${hh}:${mi}:${ss}`,
    status: 'available',
    criadoEm: seed.recordedAt,
    expiraEm: plus7days(seed.recordedAt),
  }
})

// ------------------------------------------------------------
// helpers de join: simulam o que a API devolveria em uma call única
// ------------------------------------------------------------

export function getArenaById(id: Id): Arena | undefined {
  return ARENAS.find((arena) => arena.id === id)
}

export function getQuadraById(id: Id): Quadra | undefined {
  return QUADRAS.find((quadra) => quadra.id === id)
}

export function getSponsorForCourt(courtId: Id): Patrocinador | undefined {
  const link = QUADRA_PATROCINADORES.find((qp) => qp.quadraId === courtId)
  if (!link) return undefined
  return PATROCINADORES.find((p) => p.id === link.patrocinadorId)
}

export function toReplayView(replay: Replay): ReplayView | undefined {
  const quadra = getQuadraById(replay.courtId)
  if (!quadra) return undefined
  const arena = getArenaById(quadra.arenaId)
  if (!arena) return undefined
  const sponsor = getSponsorForCourt(quadra.id)

  return {
    id: replay.id,
    court: { id: quadra.id, nome: quadra.nome },
    arena: { nome: arena.nome },
    city: arena.cidade,
    recordedAt: replay.criadoEm,
    duration: REPLAY_DURATION_SECONDS,
    expiresAt: replay.expiraEm,
    status: replay.status,
    arquivoUrl: replay.arquivoUrl,
    sponsor: sponsor
      ? { id: sponsor.id, nome: sponsor.nome, fotoUrl: sponsor.fotoUrl }
      : undefined,
  }
}

// listagem já no shape que a UI consome
export const REPLAY_VIEWS: readonly ReplayView[] = REPLAYS.map(
  toReplayView,
).filter((v): v is ReplayView => Boolean(v))
