import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/auth'
import { customInstance } from '@/lib/api/mutator/axios-instance'

export type RegisterInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}

export type AuthUser = {
  id: number
  name: string
  email: string
  phone?: string
}

type RegisterResponse = {
  message: string
  data: AuthUser
}

type LoginResponse = {
  message: string
  data: AuthUser & { token?: string }
}

export function registerUser(body: RegisterInput) {
  if (env.VITE_USE_MOCKS) return mocks.registerUser(body)
  return customInstance<RegisterResponse>({
    url: '/register',
    method: 'POST',
    data: body,
  })
}

export function loginUser(body: { email: string; password: string }) {
  if (env.VITE_USE_MOCKS) return mocks.loginUser(body)
  return customInstance<LoginResponse>({
    url: '/login',
    method: 'POST',
    data: body,
  })
}
