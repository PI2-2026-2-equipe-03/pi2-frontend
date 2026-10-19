import type { PatrocinadorDto } from '@/lib/api/patrocinadores'
import { PATROCINADORES, QUADRA_PATROCINADORES } from '@/lib/mocks'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

// cópia mutável: a exclusão precisa refletir na próxima listagem
let rows: PatrocinadorDto[] = PATROCINADORES.map((p) => ({
  ...p,
  quadraIds: QUADRA_PATROCINADORES.filter(
    (link) => link.patrocinadorId === p.id,
  ).map((link) => link.quadraId),
}))

export async function listPatrocinadores(): Promise<{
  data: PatrocinadorDto[]
}> {
  await delay()
  return { data: rows.map((p) => ({ ...p, quadraIds: [...p.quadraIds] })) }
}

export async function deletePatrocinador(id: string): Promise<void> {
  await delay()
  if (!rows.some((p) => p.id === id)) {
    throw new Error('Patrocinador não encontrado.')
  }
  rows = rows.filter((p) => p.id !== id)
}

// espelha o ON DELETE CASCADE de quadra → quadra_patrocinador
export function unlinkQuadra(quadraId: string) {
  rows = rows.map((p) => ({
    ...p,
    quadraIds: p.quadraIds.filter((id) => id !== quadraId),
  }))
}
