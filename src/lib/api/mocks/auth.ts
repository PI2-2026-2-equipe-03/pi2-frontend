import type { AuthUser, RegisterInput } from '@/lib/api/auth'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

let registerCounter = 1000

export async function loginUser(body: { email: string; password: string }) {
  await delay()
  const user: AuthUser & { token: string } = {
    id: 1,
    name: 'Dev User',
    email: body.email,
    token: 'mock-token',
  }
  return { message: 'Login realizado com sucesso', data: user }
}

export async function registerUser(body: RegisterInput) {
  await delay()
  registerCounter += 1
  const user: AuthUser = {
    id: registerCounter,
    name: body.name,
    email: body.email,
    phone: body.phone,
  }
  return { message: 'Cadastro realizado com sucesso', data: user }
}
