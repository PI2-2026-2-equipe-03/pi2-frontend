import Axios from 'axios'

type ErrorEnvelope = {
  message?: string
  error?: { message?: string }
}

export type AuthFailure = {
  code?: string
  message?: string
  status?: number
}

export type AuthField = 'email' | 'password'

const NETWORK_MESSAGE =
  'Sem conexão com o servidor. Verifique sua rede e tente novamente.'
const SERVER_MESSAGE =
  'O servidor não respondeu. Tente novamente em alguns instantes.'
const TOO_MANY_ATTEMPTS_MESSAGE =
  'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.'

const AUTH_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha inválidos',
  INVALID_PASSWORD: 'E-mail ou senha inválidos',
  EMAIL_NOT_VERIFIED: 'Confirme seu e-mail antes de entrar',
  USER_NOT_FOUND: 'Conta não encontrada',
  USER_ALREADY_EXISTS: 'E-mail já cadastrado no sistema',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'E-mail já cadastrado no sistema',
  INVALID_EMAIL: 'E-mail inválido',
  PASSWORD_TOO_SHORT: 'A senha é muito curta',
  PASSWORD_TOO_LONG: 'A senha é muito longa',
  SESSION_EXPIRED: 'Sua sessão expirou. Entre novamente.',
  FAILED_TO_CREATE_USER: 'Não foi possível criar a conta',
  FAILED_TO_CREATE_SESSION: 'Não foi possível iniciar a sessão',
}

const AUTH_FIELDS: Record<string, AuthField> = {
  INVALID_EMAIL_OR_PASSWORD: 'password',
  INVALID_PASSWORD: 'password',
  PASSWORD_TOO_SHORT: 'password',
  PASSWORD_TOO_LONG: 'password',
  USER_NOT_FOUND: 'email',
  USER_ALREADY_EXISTS: 'email',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'email',
  INVALID_EMAIL: 'email',
  EMAIL_NOT_VERIFIED: 'email',
}

// erro de auth já traduzido, carregando o campo do formulário a destacar.
export class AuthRequestError extends Error {
  readonly field?: AuthField

  constructor(message: string, field?: AuthField) {
    super(message)
    this.name = 'AuthRequestError'
    this.field = field
  }
}

// traduz a falha do authClient. mensagens não mapeadas caem no fallback do
// chamador em vez de vazar o texto em inglês da biblioteca para a tela.
export function getAuthErrorMessage(
  failure: AuthFailure,
  fallback: string,
): string {
  const mapped = failure.code ? AUTH_MESSAGES[failure.code] : undefined
  if (mapped) return mapped
  // status ausente/zero = a request nunca chegou ao servidor
  if (!failure.status) return NETWORK_MESSAGE
  // o bloqueio por tentativas (RN-03) e o rate limit da lib chegam os dois como
  // 429 sem `code`. sem este ramo cairiam no fallback "e-mail ou senha
  // inválidos" e o usuário insistiria, estendendo o próprio bloqueio.
  if (failure.status === 429) return TOO_MANY_ATTEMPTS_MESSAGE
  if (failure.status >= 500) return SERVER_MESSAGE
  return fallback
}

export function toAuthRequestError(
  failure: AuthFailure,
  fallback: string,
): AuthRequestError {
  return new AuthRequestError(
    getAuthErrorMessage(failure, fallback),
    failure.code ? AUTH_FIELDS[failure.code] : undefined,
  )
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!Axios.isAxiosError<ErrorEnvelope>(error)) {
    return error instanceof Error && error.message.trim()
      ? error.message
      : fallback
  }

  const data = error.response?.data
  if (data?.message?.trim()) return data.message
  if (data?.error?.message?.trim()) return data.error.message
  if (!error.response) return NETWORK_MESSAGE
  if (error.response.status >= 500) return SERVER_MESSAGE
  if (error.response.status === 401) {
    return 'Sua sessão expirou. Entre novamente.'
  }

  return fallback
}
