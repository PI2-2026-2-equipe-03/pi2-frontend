import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/quadras'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type QuadraDto = {
  id: number
  arenaId: number
  nome: string
  disponivel: boolean
}

type ListQuadrasResponse = {
  data: QuadraDto[]
}

export function listQuadras() {
  if (env.VITE_USE_MOCKS) return mocks.listQuadras()
  return customInstance<ListQuadrasResponse>({
    url: '/quadras',
    method: 'GET',
  })
}
