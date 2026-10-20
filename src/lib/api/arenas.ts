import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/arenas'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type ArenaDto = {
  id: string
  clienteId: string
  nome: string
  cidade: string
  endereco: string
  // backend ainda não popula foto de arena
  fotoUrl: string | null
}

type ListArenasResponse = {
  data: ArenaDto[]
}

export function listArenas() {
  if (env.VITE_USE_MOCKS) return mocks.listArenas()
  return customInstance<ListArenasResponse>({
    url: '/arenas',
    method: 'GET',
  })
}
