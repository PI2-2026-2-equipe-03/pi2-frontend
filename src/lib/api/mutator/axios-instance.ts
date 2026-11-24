import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import Axios from 'axios'

import { showForbidden } from '@/lib/auth/forbidden-signal'
import { expireSession } from '@/lib/auth/session'

// normaliza VITE_API_URL: remove /api final se vier na env (front controla o prefixo)
function normalizeBaseUrl(raw: string | undefined): string {
  const url = raw ?? '/api'
  // se for path relativo (/api), usa como está (vite proxy)
  if (url.startsWith('/')) return url.replace(/\/api\/?$/, '')
  // se for URL absoluta, remove /api final
  return url.replace(/\/api\/?$/, '')
}

const baseURL = normalizeBaseUrl(import.meta.env.VITE_API_URL)

// withCredentials inclui a cookie de sessão (Better Auth) em toda chamada.
// em dev o proxy do vite resolve same-origin; em prod exige CORS com credentials.
export const axiosInstance = Axios.create({
  baseURL,
  withCredentials: true,
})

// front controla o prefixo /api: adiciona em toda request
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url && !config.url.startsWith('http')) {
    config.url = `/api${config.url.startsWith('/') ? config.url : `/${config.url}`}`
  }
  return config
})

axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
  const status = error.response?.status
  // auth endpoints return 401 for bad credentials / invalid token, not expired session
  if (status === 401 && !error.config?.url?.startsWith('/api/auth/'))
    expireSession()
  // falha em /me já é apresentada pelo RequireRole
  if (status === 403 && error.config?.url !== '/api/me') showForbidden()
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
