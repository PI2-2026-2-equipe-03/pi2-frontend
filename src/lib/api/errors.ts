import Axios from 'axios'

type ErrorEnvelope = {
  message?: string
  error?: { message?: string }
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!Axios.isAxiosError<ErrorEnvelope>(error)) return fallback

  const data = error.response?.data
  if (data?.message?.trim()) return data.message
  if (data?.error?.message?.trim()) return data.error.message
  if (!error.response) return 'Não foi possível conectar à API'
  if (error.response.status >= 500) {
    return 'A API não respondeu. Confira se o backend está em localhost:3000.'
  }

  return fallback
}
