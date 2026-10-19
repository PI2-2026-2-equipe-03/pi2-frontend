import { removeCamerasOfQuadra } from '@/lib/api/mocks/cameras'
import { unlinkQuadra } from '@/lib/api/mocks/patrocinadores'
import type { QuadraDto } from '@/lib/api/quadras'
import { QUADRAS } from '@/lib/mocks'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

// cópia mutável: a exclusão precisa refletir na próxima listagem
let rows: QuadraDto[] = QUADRAS.map((q) => ({ ...q }))

export async function listQuadras(): Promise<{ data: QuadraDto[] }> {
  await delay()
  return { data: rows.map((q) => ({ ...q })) }
}

export async function deleteQuadra(id: string): Promise<void> {
  await delay()
  if (!rows.some((q) => q.id === id)) {
    throw new Error('Quadra não encontrada.')
  }
  rows = rows.filter((q) => q.id !== id)
  removeCamerasOfQuadra(id)
  unlinkQuadra(id)
}
