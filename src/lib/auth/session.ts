// sessão mínima persistida no client — só o que a ui precisa exibir.
// prefixo de versão evita conflito se o shape mudar (skill 4.4).

const SESSION_KEY = 'auth:v1'

export type AuthSession = {
  id: number
  name: string
  email: string
  token?: string
}

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AuthSession>
    if (
      typeof parsed.id !== 'number' ||
      typeof parsed.name !== 'string' ||
      typeof parsed.email !== 'string'
    ) {
      return null
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      token: typeof parsed.token === 'string' ? parsed.token : undefined,
    }
  } catch {
    return null
  }
}

export function saveSession(session: AuthSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // quota / modo privado — login ainda funciona nesta aba
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}
