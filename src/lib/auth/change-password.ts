import { authClient } from '@/lib/auth/client'
import { getAuthErrorMessage, SESSION_EXPIRED_MESSAGE } from '@/lib/errors'

// password change goes through better auth's native /api/auth/change-password.
// it lives outside src/lib/api/auth.ts because that file holds the custom
// /auth/* routes, which speak axios; this one rides the better auth client, so
// the session cookie is already attached and the session atom refreshes after.

export type ChangePasswordField = 'currentPassword' | 'newPassword' | 'root'

export type ChangePasswordBody = {
  currentPassword: string
  newPassword: string
}

export type ChangePasswordResult = {
  // false = the server dropped the current session along with the others
  sessionAlive: boolean
}

const FALLBACK_MESSAGE = 'Não foi possível alterar a senha'

// translated error, carrying the form field it belongs to
export class ChangePasswordError extends Error {
  readonly field: ChangePasswordField

  constructor(message: string, field: ChangePasswordField) {
    super(message)
    this.name = 'ChangePasswordError'
    this.field = field
  }
}

type ChangePasswordFailure = {
  status?: number
  message?: string
  code?: string
  // the backend rewraps better auth errors as { error: { code, message } }
  error?: { code?: string; message?: string }
}

const FIELD_BY_CODE: Record<string, ChangePasswordField> = {
  PASSWORD_TOO_SHORT: 'newPassword',
  PASSWORD_TOO_LONG: 'newPassword',
  SAME_PASSWORD: 'newPassword',
}

function toChangePasswordError(
  failure: ChangePasswordFailure,
): ChangePasswordError {
  const code = failure.code ?? failure.error?.code
  const { status } = failure

  // better auth answers "Invalid password" in english and means the current
  // password, not the login credentials, so the wording has to be ours
  if (code === 'INVALID_PASSWORD') {
    return new ChangePasswordError('Senha atual incorreta', 'currentPassword')
  }

  if (code === 'CREDENTIAL_ACCOUNT_NOT_FOUND') {
    return new ChangePasswordError(
      'Esta conta não entra por senha, então não há senha para trocar',
      'root',
    )
  }

  // a 401 here is a missing session, but the backend proxy rewrites every 401
  // as "e-mail ou senha inválidos", which makes no sense inside the app
  if (status === 401) {
    return new ChangePasswordError(SESSION_EXPIRED_MESSAGE, 'root')
  }

  // password policy and "same as the previous one" arrive as 422 already in
  // portuguese: the server is the authority, so its text goes straight to the field
  const serverMessage =
    failure.error?.message?.trim() || failure.message?.trim()
  if (status === 422 && serverMessage) {
    return new ChangePasswordError(serverMessage, 'newPassword')
  }

  return new ChangePasswordError(
    getAuthErrorMessage(failure, FALLBACK_MESSAGE),
    (code ? FIELD_BY_CODE[code] : undefined) ?? 'root',
  )
}

export async function changePassword(
  body: ChangePasswordBody,
): Promise<ChangePasswordResult> {
  let failure: ChangePasswordFailure | null = null

  try {
    const { error } = await authClient.changePassword({
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
      // someone changing the password over a suspected breach cannot leave the
      // intruder logged in on another device
      revokeOtherSessions: true,
    })
    failure = error
  } catch (error) {
    // a thrown error here is better-fetch or a bug, so its text is english
    // and belongs in the console, not in the dialog
    if (error instanceof Error) console.error(error)
    throw new ChangePasswordError(FALLBACK_MESSAGE, 'root')
  }

  if (failure) throw toChangePasswordError(failure)

  // revoking the other sessions makes the server mint a fresh cookie for this
  // one. if it never lands the user is logged out and has to be told before
  // being sent back to the login screen.
  const session = await authClient.getSession().catch(() => null)
  return { sessionAlive: Boolean(session?.data) }
}
