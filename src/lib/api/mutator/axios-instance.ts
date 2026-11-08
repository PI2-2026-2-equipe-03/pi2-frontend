import type { AxiosError, AxiosRequestConfig } from 'axios'
import Axios from 'axios'

import { showForbidden } from '@/lib/auth/forbidden-signal'
import { expireSession } from '@/lib/auth/session'

// withCredentials inclui a cookie de sessão (Better Auth) em toda chamada.
// em dev o proxy do vite resolve same-origin; em prod exige CORS com credentials.
export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
})

axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
  const status = error.response?.status
  // auth endpoints return 401 for bad credentials / invalid token, not expired session
  if (status === 401 && !error.config?.url?.startsWith('/auth/'))
    expireSession()
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
