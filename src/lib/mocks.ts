// dados mock enquanto o backend não expõe api real
// mantidos aqui para reuso entre home/arenas/quadras/replays
import { ARENA_COVERS, REPLAY_THUMB } from '@/lib/assets'

export type Sport = 'volei' | 'futebol' | 'tenis' | 'padel'

export const SPORT_LABEL: Record<Sport, string> = {
  volei: 'Vôlei',
  futebol: 'Futebol',
  tenis: 'Tênis',
  padel: 'Padel',
}

export type Arena = {
  id: string
  nome: string
  cidade: string
  distancia: string
  nota: number
  quadras: number
  esportes: readonly Sport[]
  extra: string
  cover: string
  favorita: boolean
}

export const ARENAS: readonly Arena[] = [
  {
    id: 'reriutaba-volei',
    nome: 'Reriutaba Vôlei',
    cidade: 'Barra da Tijuca, RJ',
    distancia: '2.000 km',
    nota: 4.6,
    quadras: 4,
    esportes: ['volei'],
    extra: 'Estacionamento',
    cover: ARENA_COVERS.beachVolley1,
    favorita: true,
  },
  {
    id: 'vila-sport',
    nome: 'Vila Sport',
    cidade: 'Crateús, CE',
    distancia: '2 km',
    nota: 4.9,
    quadras: 4,
    esportes: ['volei', 'futebol'],
    extra: 'Estacionamento',
    cover: ARENA_COVERS.volleyIndoor,
    favorita: true,
  },
  {
    id: 'arena-charito',
    nome: 'Arena Charito',
    cidade: 'Ipueiras, CE',
    distancia: '40 km',
    nota: 4.8,
    quadras: 6,
    esportes: ['futebol', 'tenis'],
    extra: 'Iluminação',
    cover: ARENA_COVERS.tennisCourt,
    favorita: true,
  },
  {
    id: 'campo-central',
    nome: 'Campo Central',
    cidade: 'Sobral, CE',
    distancia: '110 km',
    nota: 4.5,
    quadras: 3,
    esportes: ['futebol'],
    extra: 'Vestiário',
    cover: ARENA_COVERS.soccerAction,
    favorita: false,
  },
  {
    id: 'padel-club',
    nome: 'Padel Club Fortaleza',
    cidade: 'Fortaleza, CE',
    distancia: '300 km',
    nota: 4.7,
    quadras: 8,
    esportes: ['padel', 'tenis'],
    extra: 'Ar-condicionado',
    cover: ARENA_COVERS.padel,
    favorita: false,
  },
  {
    id: 'quintal-do-tenis',
    nome: 'Quintal do Tênis',
    cidade: 'Tianguá, CE',
    distancia: '65 km',
    nota: 4.4,
    quadras: 2,
    esportes: ['tenis'],
    extra: 'Estacionamento',
    cover: ARENA_COVERS.tennisAction,
    favorita: false,
  },
  {
    id: 'arena-praia',
    nome: 'Arena Praia',
    cidade: 'Jericoacoara, CE',
    distancia: '210 km',
    nota: 4.9,
    quadras: 5,
    esportes: ['volei', 'futebol'],
    extra: 'Iluminação',
    cover: ARENA_COVERS.soccerBalls,
    favorita: false,
  },
  {
    id: 'centro-treinamento',
    nome: 'Centro de Treinamento',
    cidade: 'Sobral, CE',
    distancia: '120 km',
    nota: 4.3,
    quadras: 4,
    esportes: ['futebol'],
    extra: 'Preparação física',
    cover: ARENA_COVERS.soccerTraining,
    favorita: false,
  },
]

export type QuadraStatus = 'online' | 'offline'

export type Quadra = {
  id: string
  nome: string
  arenaId: string
  piso: string
  esporte: Sport
  status: QuadraStatus
  cover: string
}

export const QUADRAS: readonly Quadra[] = [
  {
    id: 'q-01',
    nome: 'Quadra 01 — Areia',
    arenaId: 'reriutaba-volei',
    piso: 'Areia',
    esporte: 'volei',
    status: 'online',
    cover: ARENA_COVERS.beachVolley1,
  },
  {
    id: 'q-02',
    nome: 'Quadra 02 — Areia',
    arenaId: 'reriutaba-volei',
    piso: 'Areia',
    esporte: 'volei',
    status: 'online',
    cover: ARENA_COVERS.beachVolley1,
  },
  {
    id: 'q-03',
    nome: 'Quadra Coberta A',
    arenaId: 'vila-sport',
    piso: 'Sintético',
    esporte: 'volei',
    status: 'online',
    cover: ARENA_COVERS.volleyIndoor,
  },
  {
    id: 'q-04',
    nome: 'Quadra Coberta B',
    arenaId: 'vila-sport',
    piso: 'Sintético',
    esporte: 'futebol',
    status: 'offline',
    cover: ARENA_COVERS.soccerAction,
  },
  {
    id: 'q-05',
    nome: 'Tênis Saibro 01',
    arenaId: 'arena-charito',
    piso: 'Saibro',
    esporte: 'tenis',
    status: 'online',
    cover: ARENA_COVERS.tennisCourt,
  },
  {
    id: 'q-06',
    nome: 'Tênis Saibro 02',
    arenaId: 'arena-charito',
    piso: 'Saibro',
    esporte: 'tenis',
    status: 'online',
    cover: ARENA_COVERS.tennisAction,
  },
  {
    id: 'q-07',
    nome: 'Society Principal',
    arenaId: 'campo-central',
    piso: 'Grama sintética',
    esporte: 'futebol',
    status: 'online',
    cover: ARENA_COVERS.soccerAction,
  },
  {
    id: 'q-08',
    nome: 'Padel 01',
    arenaId: 'padel-club',
    piso: 'Cristal',
    esporte: 'padel',
    status: 'online',
    cover: ARENA_COVERS.padel,
  },
  {
    id: 'q-09',
    nome: 'Padel 02',
    arenaId: 'padel-club',
    piso: 'Cristal',
    esporte: 'padel',
    status: 'offline',
    cover: ARENA_COVERS.padel,
  },
]

export type Replay = {
  id: string
  titulo: string
  arenaId: string
  quadraId: string
  esporte: Sport
  data: string
  duracao: string
  thumb: string
}

export const REPLAYS: readonly Replay[] = [
  {
    id: 'r-01',
    titulo: 'Final do torneio de sexta',
    arenaId: 'reriutaba-volei',
    quadraId: 'q-01',
    esporte: 'volei',
    data: '2026-09-20',
    duracao: '01:12:34',
    thumb: ARENA_COVERS.beachVolley1,
  },
  {
    id: 'r-02',
    titulo: 'Amistoso interclubes',
    arenaId: 'vila-sport',
    quadraId: 'q-03',
    esporte: 'volei',
    data: '2026-09-18',
    duracao: '58:20',
    thumb: ARENA_COVERS.volleyIndoor,
  },
  {
    id: 'r-03',
    titulo: 'Copa Charito — quartas',
    arenaId: 'arena-charito',
    quadraId: 'q-05',
    esporte: 'tenis',
    data: '2026-09-15',
    duracao: '02:03:11',
    thumb: ARENA_COVERS.tennisAction,
  },
  {
    id: 'r-04',
    titulo: 'Racha da terça',
    arenaId: 'campo-central',
    quadraId: 'q-07',
    esporte: 'futebol',
    data: '2026-09-14',
    duracao: '45:12',
    thumb: ARENA_COVERS.soccerAction,
  },
  {
    id: 'r-05',
    titulo: 'Padel Open — 2ª rodada',
    arenaId: 'padel-club',
    quadraId: 'q-08',
    esporte: 'padel',
    data: '2026-09-12',
    duracao: '01:34:02',
    thumb: ARENA_COVERS.padel,
  },
  {
    id: 'r-06',
    titulo: 'Treino técnico noturno',
    arenaId: 'vila-sport',
    quadraId: 'q-04',
    esporte: 'futebol',
    data: '2026-09-10',
    duracao: '39:47',
    thumb: REPLAY_THUMB,
  },
]
