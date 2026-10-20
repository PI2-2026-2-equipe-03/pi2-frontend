import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/quadras'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type QuadraDto = {
  id: string
  arenaId: string
  nome: string
  disponivel: boolean
}

type ListQuadrasResponse = {
  data: QuadraDto[]
}

// DELETE /quadras/:id ainda não existe no backend (B3-02). a listagem já é
// real, então não dá para cair no mock: os ids do banco não existem nele.
const DELETE_READY = false

export function listQuadras() {
  if (env.VITE_USE_MOCKS) return mocks.listQuadras()
  return customInstance<ListQuadrasResponse>({
    url: '/quadras',
    method: 'GET',
  })
}

export function deleteQuadra(id: string) {
  if (env.VITE_USE_MOCKS) return mocks.deleteQuadra(id)
  if (!DELETE_READY) {
    return Promise.reject(
      new Error('A exclusão de quadras ainda não está disponível na API.'),
    )
  }
  return customInstance<void>({
    url: `/quadras/${id}`,
    method: 'DELETE',
  })
}
