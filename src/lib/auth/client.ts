import { createAuthClient } from 'better-auth/react'

import { env } from '@/env'

// normaliza VITE_API_URL: remove /api final se vier na env (front controla o prefixo)
function normalizeBaseUrl(raw: string | undefined): string {
  const url = raw ?? ''
  if (url.startsWith('/')) return url.replace(/\/api\/?$/, '')
  return url.replace(/\/api\/?$/, '')
}

const apiOrigin = normalizeBaseUrl(env.VITE_API_URL)

// better-auth client usa baseURL (origin) + basePath ('/api/auth')
// front controla o prefixo /api: apiOrigin SEM /api final
export const authClient = createAuthClient(
  apiOrigin ? { baseURL: apiOrigin, basePath: '/api/auth' } : {},
)

export const { signIn, signUp, signOut, useSession } = authClient
