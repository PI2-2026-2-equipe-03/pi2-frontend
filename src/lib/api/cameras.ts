import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/cameras'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type CameraDto = {
  id: string
  quadraId: string
  identificador: string
  status: string
}

type ListCamerasResponse = {
  data: CameraDto[]
}

// GET/DELETE /cameras ainda não existem no backend (B3-02). até lá o domínio
// fica no mock mesmo com VITE_USE_MOCKS=false; quando a rota sair, é só
// virar esta flag.
const ENDPOINT_READY = false

const fromMocks = env.VITE_USE_MOCKS || !ENDPOINT_READY

export function listCameras() {
  if (fromMocks) return mocks.listCameras()
  return customInstance<ListCamerasResponse>({
    url: '/cameras',
    method: 'GET',
  })
}

export function deleteCamera(id: string) {
  if (fromMocks) return mocks.deleteCamera(id)
  return customInstance<void>({
    url: `/cameras/${id}`,
    method: 'DELETE',
  })
}
