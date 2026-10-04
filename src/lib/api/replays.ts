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
  return customInstance<ListReplaysResponse>({
    url: '/replays',
    method: 'GET',
  })
}

export function getReplayDownload(id: number | string) {
  return customInstance<ReplayDownloadResponse>({
    url: `/replays/${id}/download`,
    method: 'GET',
  })
}
