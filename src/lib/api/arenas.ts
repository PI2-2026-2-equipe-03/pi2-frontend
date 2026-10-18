import { customInstance } from '@/lib/api/mutator/axios-instance'

export type ArenaDto = {
  id: number | string
  clienteId: number | string
  nome: string
  cidade: string
  endereco: string
  fotoUrl: string | null
}

type ListArenasResponse = {
  data: ArenaDto[]
}

export function listArenas() {
  return customInstance<ListArenasResponse>({
    url: '/arenas',
    method: 'GET',
  })
}
