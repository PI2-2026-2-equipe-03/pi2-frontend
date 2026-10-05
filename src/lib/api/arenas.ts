import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/arenas'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type ArenaDto = {
  id: number
  clienteId: number
  nome: string
  cidade: string
  endereco: string
  fotoUrl: string
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
