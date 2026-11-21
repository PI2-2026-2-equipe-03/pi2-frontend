import type { AxiosError } from 'axios'

import { env } from '@/env'
import * as mocks from '@/lib/api/mocks/auth'
import { axiosInstance } from '@/lib/api/mutator/axios-instance'

// custom auth endpoints live at /auth/* on the backend (not /api/auth/*).
// bypass the /api baseURL so requests hit the /auth vite proxy rule directly.
const AUTH_CFG = { baseURL: '' }

export type RegisterBody = {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export type RegisterResponse = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
  role: string
}

export type LoginBody = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  expiresIn: number
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export type ForgotPasswordBody = {
  email: string
}

export type MessageResponse = {
  message: string
}

export type ResetPasswordBody = {
  token: string
  password: string
  passwordConfirmation: string
}

export async function registerUser(
  body: RegisterBody,
): Promise<RegisterResponse> {
  if (env.VITE_USE_MOCKS) return mocks.registerUser(body)
  const { data } = await axiosInstance.post<RegisterResponse>(
    '/auth/register',
    body,
    AUTH_CFG,
  )
  return data
}

export async function loginUser(body: LoginBody): Promise<LoginResponse> {
  if (env.VITE_USE_MOCKS) return mocks.loginUser(body)
  const { data } = await axiosInstance.post<LoginResponse>(
    '/auth/login',
    body,
    AUTH_CFG,
  )
  return data
}

export async function forgotPassword(
  body: ForgotPasswordBody,
): Promise<MessageResponse> {
  if (env.VITE_USE_MOCKS) return mocks.forgotPassword(body)
  const { data } = await axiosInstance.post<MessageResponse>(
    '/auth/forgot-password',
    body,
    AUTH_CFG,
  )
  return data
}

export async function resetPassword(
  body: ResetPasswordBody,
): Promise<MessageResponse> {
  if (env.VITE_USE_MOCKS) return mocks.resetPassword()
  const { data } = await axiosInstance.post<MessageResponse>(
    '/auth/reset-password',
    body,
    AUTH_CFG,
  )
  return data
}

export type { AxiosError }
