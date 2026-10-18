import { createAuthClient } from 'better-auth/react'

// same-origin: o browser roda em http://localhost:5173 e o vite proxia /api/auth/*
// para o backend. em produção, basta expor /api/auth/* no mesmo host do SPA.
export const authClient = createAuthClient()

export const { signIn, signUp, signOut, useSession } = authClient
