import type { ArenaDto } from '@/lib/api/arenas'
import type { QuadraDto } from '@/lib/api/quadras'
import type { ReplayDto } from '@/lib/api/replays'
import {
  type Arena,
  type Quadra,
  REPLAY_DURATION_SECONDS,
  type ReplayStatus,
  type ReplayView,
} from '@/lib/types'

export function toArena(dto: ArenaDto): Arena {
  return {
    id: dto.id,
    clienteId: dto.clienteId,
    nome: dto.nome,
    cidade: dto.cidade,
    endereco: dto.endereco,
    fotoUrl: dto.fotoUrl,
  }
}

export function toQuadra(dto: QuadraDto): Quadra {
  return {
    id: dto.id,
    arenaId: dto.arenaId,
    nome: dto.nome,
    disponivel: dto.disponivel,
  }
}

function mapReplayStatus(status: string): ReplayStatus {
  const normalized = status.trim().toLowerCase()
  if (normalized === 'pendente' || normalized === 'pending') return 'pending'
  if (normalized === 'excluido' || normalized === 'deleted') return 'deleted'
  return 'available'
}

function toIsoDateTime(
  recordingDate?: string,
  recordingTime?: string,
  createdAt?: string,
): string {
  if (createdAt) {
    const parsed = new Date(createdAt)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
  }

  if (!recordingDate) return new Date().toISOString()

  const datePart = String(recordingDate).slice(0, 10)
  const timePart = recordingTime
    ? String(recordingTime).slice(0, 8)
    : '00:00:00'
  const parsed = new Date(`${datePart}T${timePart}`)
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString()
  return parsed.toISOString()
}

export function toReplayView(dto: ReplayDto): ReplayView {
  return {
    id: dto.id,
    court: { id: dto.courtId, nome: dto.courtName ?? `Quadra ${dto.courtId}` },
    arena: { id: dto.courtId, nome: dto.arenaName ?? 'Arena' },
    city: dto.city ?? '',
    recordedAt: toIsoDateTime(
      dto.recordingDate,
      dto.recordingTime,
      dto.createdAt,
    ),
    duration: REPLAY_DURATION_SECONDS,
    expiresAt: dto.expiresAt ?? new Date().toISOString(),
    status: mapReplayStatus(dto.status),
    arquivoUrl: dto.downloadUrl ?? '',
  }
}

export function resolveMediaUrl(path: string): string {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path

  const base = import.meta.env.VITE_API_URL ?? '/api'
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${prefix}${suffix}`
}
