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
  return customInstance<RegisterResponse>({
    url: '/register',
    method: 'POST',
    data: body,
  })
}

export function loginUser(body: { email: string; password: string }) {
  return customInstance<LoginResponse>({
    url: '/login',
    method: 'POST',
    data: body,
  })
}
