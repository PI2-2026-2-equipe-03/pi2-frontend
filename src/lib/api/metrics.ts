import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/metrics'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type AdminMetricsDto = {
  activeUsers: number
  totalCourts: number
  totalReplays: number
  mostAccessedCourts: { courtId: string; name: string; accesses: number }[]
}

export type ManagerMetricsDto = {
  totalReplays: number
  totalSponsors: number
  peakHours: { hour: string; accesses: number }[]
  courts: { id: string; name: string; replays: number }[]
}

// as rotas de métricas respondem sem o envelope { data }
export function getAdminMetrics() {
  if (env.VITE_USE_MOCKS) return mocks.getAdminMetrics()
  return customInstance<AdminMetricsDto>({
    url: '/admin/metrics',
    method: 'GET',
  })
}

export function getManagerMetrics() {
  if (env.VITE_USE_MOCKS) return mocks.getManagerMetrics()
  return customInstance<ManagerMetricsDto>({
    url: '/manager/metrics',
    method: 'GET',
  })
}
