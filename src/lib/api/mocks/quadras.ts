import type { QuadraDto } from '@/lib/api/quadras'
import { QUADRAS } from '@/lib/mocks'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

export async function listQuadras(): Promise<{ data: QuadraDto[] }> {
  await delay()
  return { data: QUADRAS.map((q) => ({ ...q })) }
}
