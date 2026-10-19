import type { CameraDto } from '@/lib/api/cameras'
import { CAMERAS } from '@/lib/mocks'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

// cópia mutável: a exclusão precisa refletir na próxima listagem
let rows: CameraDto[] = CAMERAS.map((c) => ({ ...c }))

export async function listCameras(): Promise<{ data: CameraDto[] }> {
  await delay()
  return { data: rows.map((c) => ({ ...c })) }
}

export async function deleteCamera(id: string): Promise<void> {
  await delay()
  if (!rows.some((c) => c.id === id)) {
    throw new Error('Câmera não encontrada.')
  }
  rows = rows.filter((c) => c.id !== id)
}

// espelha o ON DELETE CASCADE de quadra → camera
export function removeCamerasOfQuadra(quadraId: string) {
  rows = rows.filter((c) => c.quadraId !== quadraId)
}
