import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { env } from '@/env'
import { authClient } from '@/lib/auth/client'
import { queryClient } from '@/lib/react-query'
import type { UserRole } from '@/lib/types'

// sessão em localStorage usada APENAS no modo mocks (VITE_USE_MOCKS=true).
// no modo real a sessão vive na cookie HttpOnly do Better Auth e é resolvida
// pelo useAuthSession abaixo.
const SESSION_KEY = 'auth:v1'

export type MockSession = {
  id: number | string
  name: string
  email: string
  token?: string
  role?: UserRole
}

export function getMockSession(): MockSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<MockSession>
    if (typeof parsed.name !== 'string' || typeof parsed.email !== 'string') {
      return null
    }
    const id =
      typeof parsed.id === 'string' || typeof parsed.id === 'number'
        ? parsed.id
        : 0
    return {
      id,
      name: parsed.name,
      email: parsed.email,
      token: typeof parsed.token === 'string' ? parsed.token : undefined,
      role: parsed.role,
    }
  } catch {
    return null
  }
}

export function saveMockSession(session: MockSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // quota / modo privado: login ainda funciona nesta aba
  }
}

export function clearMockSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthSessionState = {
  data: { user: AuthUser } | null
  isPending: boolean
}

// hook unificado para consumidores de ui (nav, guards, telas). sempre invoca
// authClient.useSession para respeitar as regras de hooks; no modo mocks o
// resultado é ignorado em favor do localStorage.
//
// força getSession() antes de decidir "não autenticado".
// sem isso o guard pode ver null por um instante no primeiro login e redirecionar.
export function useAuthSession(): AuthSessionState {
  const live = authClient.useSession()
  const [initialProbeDone, setInitialProbeDone] = useState(env.VITE_USE_MOCKS)

  useEffect(() => {
    if (env.VITE_USE_MOCKS) return
    let active = true
    authClient.getSession().finally(() => {
      if (active) setInitialProbeDone(true)
    })
    return () => {
      active = false
    }
  }, [])

  return useMemo<AuthSessionState>(() => {
    if (env.VITE_USE_MOCKS) {
      const mock = getMockSession()
      return {
        data: mock
          ? {
              user: {
                id: String(mock.id),
                name: mock.name,
                email: mock.email,
              },
            }
          : null,
        isPending: false,
      }
    }

    const user = live.data?.user
    return {
      data: user
        ? {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          }
        : null,
      isPending: live.isPending || !initialProbeDone,
    }
  }, [live.data, live.isPending, initialProbeDone])
}

// logout unificado: limpa localStorage (mocks) ou dispara sign-out (real).
// também limpa o cache do react-query.
export async function signOut(): Promise<void> {
  signingOut = true
  if (env.VITE_USE_MOCKS) {
    clearMockSession()
  } else {
    await authClient.signOut()
  }
  queryClient.clear()
}

const SESSION_EXPIRED_PATH = '/sign-in?reason=session-expired'

// distingue o "sair" voluntário da sessão que sumiu sozinha
let signingOut = false
let expiring = false

// vários 401 simultâneos chegam aqui: só o primeiro age. a recarga completa zera
// o cache em memória; o sign-out garante que o cookie não ressuscite a sessão.
// durante o logout voluntário, um 401 tardio é esperado e não é expiração.
export function expireSession(): void {
  if (expiring || signingOut) return
  expiring = true
  void authClient.signOut().finally(() => {
    window.location.assign(SESSION_EXPIRED_PATH)
  })
}

// guard das áreas autenticadas: sessão ausente volta para o login, com aviso de
// expiração quando havia sessão e o usuário não pediu para sair.
export function useSessionGuard(): AuthSessionState {
  const state = useAuthSession()
  const navigate = useNavigate()
  const hadSession = useRef(false)

  useEffect(() => {
    signingOut = false
  }, [])

  useEffect(() => {
    if (state.data) {
      hadSession.current = true
      return
    }
    if (state.isPending) return
    navigate(
      hadSession.current && !signingOut ? SESSION_EXPIRED_PATH : '/sign-in',
      { replace: true },
    )
  }, [state.data, state.isPending, navigate])

  return state
}
