import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/replays'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type ReplayDto = {
  id: number | string
  courtId: number | string
  downloadUrl: string | null
  recordingDate?: string
  recordingTime?: string
  createdAt?: string
  expiresAt?: string | null
  status: string
  courtName?: string
  arenaName?: string
  city?: string
}

export type ReplayDownloadDto = {
  id: number | string
  fileName: string
  downloadUrl: string
}

type ListReplaysResponse = {
  data: ReplayDto[]
}

type ReplayDownloadResponse = {
  data: ReplayDownloadDto
}

export function listReplays() {
  if (env.VITE_USE_MOCKS) return mocks.listReplays()
  return customInstance<ListReplaysResponse>({
    url: '/replays',
    method: 'GET',
  })
}

export function getReplayDownload(id: number | string) {
  if (env.VITE_USE_MOCKS) return mocks.getReplayDownload(id)
  return customInstance<ReplayDownloadResponse>({
    url: `/replays/${id}/download`,
    method: 'GET',
  })
}
