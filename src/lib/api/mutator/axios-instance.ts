import Axios from 'axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'

export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
  // encaixa o cancel no .cancel pra integrar com AbortController do react-query v5
  // vi na documentação
  ;(promise as Promise<T> & { cancel: () => void }).cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}

export type ErrorType<Error> = AxiosError<Error>

export type BodyType<BodyData> = BodyData
