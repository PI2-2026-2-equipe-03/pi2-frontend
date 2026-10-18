import { customInstance } from '@/lib/api/mutator/axios-instance'

export type QuadraDto = {
  id: number | string
  arenaId: number | string
  nome: string
  disponivel: boolean
}

type ListQuadrasResponse = {
  data: QuadraDto[]
}

export function listQuadras() {
  return customInstance<ListQuadrasResponse>({
    url: '/quadras',
    method: 'GET',
  })
}
