import type { ManagerRequestResponse } from '@/lib/api/manager-requests'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

let hasPendingRequest = false

// espelha o índice único do banco: uma solicitação pendente por usuário
export async function createManagerRequest(): Promise<ManagerRequestResponse> {
  await delay()
  if (hasPendingRequest) {
    throw new Error('Você já possui uma solicitação pendente')
  }
  hasPendingRequest = true
  return {
    id: 1,
    userId: 'mock-user',
    status: 'PENDING',
    message: 'Solicitação enviada. Aguarde a análise dos administradores.',
  }
}
