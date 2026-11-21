import { authClient } from '@/lib/auth/client'
import { SESSION_EXPIRED_MESSAGE, toAuthRequestError } from '@/lib/errors'

// o backend reembala o erro do Better Auth em { error: { code, message } } e o
// cliente devolve esse corpo acrescido de status.
type ChangePasswordFailure = {
  code?: string
  message?: string
  status?: number
  error?: { code?: string; message?: string }
}

export type ChangePasswordField = 'currentPassword' | 'newPassword' | 'root'

export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
}

export type ChangePasswordResult = {
  // a rota apaga todas as sessões e cria uma nova para este aparelho. se o
  // cookie novo não voltar, o usuário precisa entrar outra vez.
  sessionSurvived: boolean
}

// erro da troca de senha já traduzido, carregando o campo a destacar
export class ChangePasswordError extends Error {
  readonly field: ChangePasswordField

  constructor(message: string, field: ChangePasswordField) {
    super(message)
    this.name = 'ChangePasswordError'
    this.field = field
  }
}

const FALLBACK_MESSAGE = 'Não foi possível alterar a senha'

// "senha inválida" aqui é sempre a senha atual: a nova nem chega a ser testada.
// o texto genérico de login mandaria o usuário olhar o campo errado.
const CODE_ERRORS: Record<
  string,
  { message: string; field: ChangePasswordField }
> = {
  INVALID_PASSWORD: {
    message: 'Senha atual incorreta',
    field: 'currentPassword',
  },
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    message: 'Esta conta não entra com senha',
    field: 'root',
  },
  UNAUTHORIZED: { message: SESSION_EXPIRED_MESSAGE, field: 'root' },
}

function toChangePasswordError(
  failure: ChangePasswordFailure,
): ChangePasswordError {
  const code = failure.code ?? failure.error?.code
  const mapped = code ? CODE_ERRORS[code] : undefined
  if (mapped) return new ChangePasswordError(mapped.message, mapped.field)

  // 422 é a política de complexidade e a recusa da senha anterior. o texto já
  // vem em português do backend e pertence ao campo da nova senha.
  const serverMessage =
    failure.error?.message?.trim() || failure.message?.trim()
  if (failure.status === 422 && serverMessage) {
    return new ChangePasswordError(serverMessage, 'newPassword')
  }

  const authError = toAuthRequestError(
    { code, status: failure.status },
    FALLBACK_MESSAGE,
  )
  return new ChangePasswordError(
    authError.message,
    authError.field === 'password' ? 'newPassword' : 'root',
  )
}

// troca a senha pela rota nativa do Better Auth (/api/auth/change-password).
// a política de complexidade e a recusa da senha anterior são do servidor.
export async function changePassword(
  input: ChangePasswordInput,
): Promise<ChangePasswordResult> {
  const { error } = await authClient.changePassword({
    currentPassword: input.currentPassword,
    newPassword: input.newPassword,
    // trocar a senha tem que invalidar o acesso antigo em todo lugar; sem isso
    // a sessão aberta em outro aparelho continuaria valendo.
    revokeOtherSessions: true,
  })

  if (error) throw toChangePasswordError(error)

  // confirmamos a sessão com o servidor em vez de supor. se a própria checagem
  // falhar, não derrubamos o usuário à força.
  const session = await authClient.getSession()
  return { sessionSurvived: Boolean(session.data) || Boolean(session.error) }
}
