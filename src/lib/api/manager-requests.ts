import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/manager-requests'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type ManagerRequestBody = {
  cpf: string
  cnpj?: string
  companyName: string
  courtQuantity: number
  address: {
    street: string
    neighborhood: string
    zipCode: string
    city: string
    state: string
  }
}

export type ManagerRequestResponse = {
  id: number
  userId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  message: string
}

export function createManagerRequest(body: ManagerRequestBody) {
  if (env.VITE_USE_MOCKS) return mocks.createManagerRequest()
  return customInstance<ManagerRequestResponse>({
    url: '/manager-requests',
    method: 'POST',
    data: body,
  })
}
