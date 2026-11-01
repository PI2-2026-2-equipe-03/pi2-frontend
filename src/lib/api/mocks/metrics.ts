import type { AdminMetricsDto, ManagerMetricsDto } from '@/lib/api/metrics'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

export async function getAdminMetrics(): Promise<AdminMetricsDto> {
  await delay()
  return {
    activeUsers: 12,
    totalCourts: 4,
    totalReplays: 24,
    mostAccessedCourts: [
      { courtId: 'mock-quadra-1', name: 'Quadra 01', accesses: 18 },
      { courtId: 'mock-quadra-2', name: 'Quadra 02', accesses: 9 },
    ],
  }
}

export async function getManagerMetrics(): Promise<ManagerMetricsDto> {
  await delay()
  return {
    totalReplays: 14,
    totalSponsors: 2,
    peakHours: [
      { hour: '19:00', accesses: 11 },
      { hour: '20:00', accesses: 7 },
    ],
    courts: [
      { id: 'mock-quadra-1', name: 'Quadra 01', replays: 10 },
      { id: 'mock-quadra-2', name: 'Quadra 02', replays: 4 },
    ],
  }
}
