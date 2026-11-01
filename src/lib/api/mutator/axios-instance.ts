import type { AxiosError, AxiosRequestConfig } from 'axios'
import Axios from 'axios'

import { showForbidden } from '@/lib/auth/forbidden-signal'
import { expireSession } from '@/lib/auth/session'

// withCredentials: true inclui a cookie da sessão (Better Auth) em toda chamada.
// em dev as calls vão para /api/* via proxy do vite — same-origin, cookie HttpOnly
// chega sem precisar de CORS. em prod exige CORS com credentials no backend.
export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
})

axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
  const status = error.response?.status
  if (status === 401) expireSession()
  // falha em /me já é apresentada pelo RequireRole
  if (status === 403 && error.config?.url !== '/me') showForbidden()
  return Promise.reject(error)
})

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source()
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data)

  // orval espera uma promise cancelável quando react-query usa signal
  ;(promise as Promise<T> & { cancel: () => void }).cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}

export type ErrorType<Error> = AxiosError<Error>

export type BodyType<BodyData> = BodyData
