import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/auth'
import { customInstance } from '@/lib/api/mutator/axios-instance'
import type { UserRole } from '@/lib/types'

export type CurrentUserDto = {
  id: string
  name: string
  email: string
  role: UserRole
}

type MeResponse = {
  data: CurrentUserDto
}

export function getMe() {
  if (env.VITE_USE_MOCKS) return mocks.getMe()
  return customInstance<MeResponse>({
    url: '/me',
    method: 'GET',
  })
}
