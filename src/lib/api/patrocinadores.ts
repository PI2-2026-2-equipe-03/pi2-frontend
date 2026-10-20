import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/patrocinadores'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type PatrocinadorDto = {
  id: string
  gestorId: string
  nome: string
  fotoUrl: string | null
  duracao: number
  // NUMERIC do postgres chega como string pelo driver pg
  valor: number | string
  quadraIds: string[]
}

type ListPatrocinadoresResponse = {
  data: PatrocinadorDto[]
}

// GET/DELETE /patrocinadores ainda não existem no backend (B3-02). até lá o
// domínio fica no mock mesmo com VITE_USE_MOCKS=false; quando a rota sair, é
// só virar esta flag.
const ENDPOINT_READY = false

const fromMocks = env.VITE_USE_MOCKS || !ENDPOINT_READY

export function listPatrocinadores() {
  if (fromMocks) return mocks.listPatrocinadores()
  return customInstance<ListPatrocinadoresResponse>({
    url: '/patrocinadores',
    method: 'GET',
  })
}

export function deletePatrocinador(id: string) {
  if (fromMocks) return mocks.deletePatrocinador(id)
  return customInstance<void>({
    url: `/patrocinadores/${id}`,
    method: 'DELETE',
  })
}
