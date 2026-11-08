import type { AxiosError } from 'axios'

import { axiosInstance } from '@/lib/api/mutator/axios-instance'

// custom auth endpoints live at /auth/* on the backend (not /api/auth/*).
// bypass the /api baseURL so requests hit the /auth vite proxy rule directly.
const AUTH_CFG = { baseURL: '' }

type RegisterBody = {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

type RegisterResponse = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
  role: string
}

type LoginBody = {
  email: string
  password: string
}

type LoginResponse = {
  token: string
  expiresIn: number
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

type ForgotPasswordBody = {
  email: string
}

type MessageResponse = {
  message: string
}

type ResetPasswordBody = {
  token: string
  password: string
  passwordConfirmation: string
}

export async function registerUser(body: RegisterBody): Promise<RegisterResponse> {
  const { data } = await axiosInstance.post<RegisterResponse>(
    '/auth/register',
    body,
    AUTH_CFG,
  )
  return data
}

export async function loginUser(body: LoginBody): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>(
    '/auth/login',
    body,
    AUTH_CFG,
  )
  return data
}

export async function forgotPassword(body: ForgotPasswordBody): Promise<MessageResponse> {
  const { data } = await axiosInstance.post<MessageResponse>(
    '/auth/forgot-password',
    body,
    AUTH_CFG,
  )
  return data
}

export async function resetPassword(body: ResetPasswordBody): Promise<MessageResponse> {
  const { data } = await axiosInstance.post<MessageResponse>(
    '/auth/reset-password',
    body,
    AUTH_CFG,
  )
  return data
}

export type { AxiosError }
