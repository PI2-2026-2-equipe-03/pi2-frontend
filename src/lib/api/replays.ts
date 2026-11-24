import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/replays'
import { customInstance } from '@/lib/api/mutator/axios-instance'

// english field names on purpose: this is the api contract (r.patrocinadores
// AS sponsors), not the domain model
export type ReplaySponsorDto = {
  id: string
  name: string
  imageUrl: string | null
}

export type ReplayDto = {
  id: string
  courtId: string
  downloadUrl: string | null
  recordingDate?: string
  recordingTime?: string
  createdAt?: string
  expiresAt?: string | null
  status: string
  courtName?: string
  arenaName?: string
  city?: string
  // optional because the dev database may still lack duracao_segundos and
  // patrocinadores (B-00); the api declares both as required
  duration?: number
  sponsors?: ReplaySponsorDto[]
}

// o backend responde só { id, downloadUrl }; o nome do arquivo fica por conta
// de quem consome.
export type ReplayDownloadDto = {
  id: string
  fileName?: string
  downloadUrl: string
}

export type CreateReplayBody = {
  courtId: string
}

export type CreateReplayResponse = {
  data: ReplayDto
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

export function createReplay(body: CreateReplayBody) {
  if (env.VITE_USE_MOCKS) return mocks.createReplay(body)
  return customInstance<CreateReplayResponse>({
    url: '/replays',
    method: 'POST',
    data: body,
  })
}

export function getReplayDownload(id: string) {
  if (env.VITE_USE_MOCKS) return mocks.getReplayDownload(id)
  return customInstance<ReplayDownloadResponse>({
    url: `/replays/${id}/download`,
    method: 'GET',
  })
}
