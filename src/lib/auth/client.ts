import { createAuthClient } from 'better-auth/react'

import { env } from '@/env'

// better-auth appends its own basePath (/api/auth) to this, so it takes the
// api origin, never a path. without it the client falls back to the page
// origin, which on a separate deploy is the spa host and answers 404 to every
// session call. in dev VITE_API_URL is unset and the vite proxy serves
// /api/auth from the same origin, which is why the bug only shows in prod.
const apiOrigin = env.VITE_API_URL

export const authClient = createAuthClient(
  apiOrigin && /^https?:\/\//i.test(apiOrigin) ? { baseURL: apiOrigin } : {},
)

export const { signIn, signUp, signOut, useSession } = authClient
