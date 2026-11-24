import type { AdminMetricsDto, ManagerMetricsDto } from '@/lib/api/metrics'
import { isWithinWindow, retentionWindow } from '@/lib/dates'
import {
  ARENAS,
  PATROCINADORES,
  QUADRA_PATROCINADORES,
  QUADRAS,
  REPLAYS,
} from '@/lib/mocks'
import type { Id, Replay } from '@/lib/types'

const MOCK_DELAY_MS = 400
const RANKING_SIZE = 5

// stands in for the logged manager: no mock user is tied to an arena
const MOCK_MANAGER_ARENA_ID: Id = '1'

// the mock has no user table or session registry, so this has no origin in
// the seed; it is a plausible literal, not a count
const MOCK_ACTIVE_USERS = 12

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

// same window the replay list filters by, so the totals cannot diverge from it
function activeReplays(): Replay[] {
  const retention = retentionWindow(new Date())
  return REPLAYS.filter((replay) =>
    isWithinWindow(new Date(replay.criadoEm), retention),
  )
}

// the mock has no download event, so downloads are made up per replay: stable
// (derived from the id, never random) and spread over 1-3 so rankings differ
function mockDownloads(replay: Replay): number {
  return 1 + (Number(replay.id) % 3)
}

function byAccessesThenLabel<T extends { accesses: number }>(
  label: (item: T) => string,
) {
  return (a: T, b: T) =>
    b.accesses - a.accesses || label(a).localeCompare(label(b))
}

function downloadsByCourt(replays: Replay[]) {
  const totals = new Map<Id, number>()
  for (const replay of replays) {
    totals.set(
      replay.courtId,
      (totals.get(replay.courtId) ?? 0) + mockDownloads(replay),
    )
  }
  return totals
}

export async function getAdminMetrics(): Promise<AdminMetricsDto> {
  await delay()
  const replays = activeReplays()
  const downloads = downloadsByCourt(replays)
  const mostAccessedCourts = QUADRAS.flatMap((quadra) => {
    const accesses = downloads.get(quadra.id)
    return accesses ? [{ courtId: quadra.id, name: quadra.nome, accesses }] : []
  })
    .sort(byAccessesThenLabel((court) => court.name))
    .slice(0, RANKING_SIZE)

  return {
    activeUsers: MOCK_ACTIVE_USERS,
    totalCourts: QUADRAS.length,
    totalReplays: replays.length,
    mostAccessedCourts,
  }
}

export async function getManagerMetrics(): Promise<ManagerMetricsDto> {
  await delay()
  const arena = ARENAS.find((a) => a.id === MOCK_MANAGER_ARENA_ID)
  const quadras = QUADRAS.filter((q) => q.arenaId === arena?.id)
  const courtIds = new Set(quadras.map((q) => q.id))
  const replays = activeReplays().filter((r) => courtIds.has(r.courtId))

  const sponsorIds = new Set(
    QUADRA_PATROCINADORES.filter((link) => courtIds.has(link.quadraId)).map(
      (link) => link.patrocinadorId,
    ),
  )

  // the download time is unknown, so the recording hour (local) stands in
  const byHour = new Map<string, number>()
  for (const replay of replays) {
    const hour = `${String(new Date(replay.criadoEm).getHours()).padStart(2, '0')}:00`
    byHour.set(hour, (byHour.get(hour) ?? 0) + mockDownloads(replay))
  }
  const peakHours = [...byHour]
    .map(([hour, accesses]) => ({ hour, accesses }))
    .sort(byAccessesThenLabel((peak) => peak.hour))
    .slice(0, RANKING_SIZE)

  return {
    totalReplays: replays.length,
    totalSponsors: PATROCINADORES.filter((p) => sponsorIds.has(p.id)).length,
    peakHours,
    courts: quadras.map((quadra) => ({
      id: quadra.id,
      name: quadra.nome,
      replays: replays.filter((r) => r.courtId === quadra.id).length,
    })),
  }
}
