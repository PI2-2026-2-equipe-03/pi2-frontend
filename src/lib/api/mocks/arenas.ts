import type { ArenaDto } from '@/lib/api/arenas'
import { ARENAS } from '@/lib/mocks'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

export async function listArenas(): Promise<{ data: ArenaDto[] }> {
  await delay()
  return { data: ARENAS.map((a) => ({ ...a })) }
}
