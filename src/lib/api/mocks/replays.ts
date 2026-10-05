import type { ReplayDownloadDto,ReplayDto } from '@/lib/api/replays'
import { REPLAY_VIEWS } from '@/lib/mocks'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

function toReplayDto(view: (typeof REPLAY_VIEWS)[number]): ReplayDto {
  const recorded = new Date(view.recordedAt)
  const date = recorded.toISOString().slice(0, 10)
  const time = recorded.toISOString().slice(11, 19)
  return {
    id: view.id,
    courtId: view.court.id,
    downloadUrl: view.arquivoUrl,
    recordingDate: date,
    recordingTime: time,
    createdAt: view.recordedAt,
    expiresAt: view.expiresAt,
    status: view.status,
    courtName: view.court.nome,
    arenaName: view.arena.nome,
    city: view.city,
  }
}

export async function listReplays() {
  await delay()
  return { data: REPLAY_VIEWS.map(toReplayDto) }
}

export async function getReplayDownload(
  id: number | string,
): Promise<{ data: ReplayDownloadDto }> {
  await delay()
  const view = REPLAY_VIEWS.find((r) => String(r.id) === String(id))
  if (!view) {
    throw new Error('Replay não encontrado')
  }
  return {
    data: {
      id: view.id,
      fileName: `replay-${view.id}.mp4`,
      downloadUrl: view.arquivoUrl,
    },
  }
}
