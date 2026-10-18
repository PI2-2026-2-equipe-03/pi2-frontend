// mocks locais para auth — ativados por VITE_USE_MOCKS=true.
// o fluxo real usa `@/lib/auth/client` (Better Auth) e não passa por aqui.

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

export type MockRegisterInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}

export type MockAuthUser = {
  id: number
  name: string
  email: string
  phone?: string
}

let registerCounter = 1000

export async function loginUser(body: { email: string; password: string }) {
  await delay()
  const user: MockAuthUser & { token: string } = {
    id: 1,
    name: 'Dev User',
    email: body.email,
    token: 'mock-token',
  }
  return { message: 'Login realizado com sucesso', data: user }
}

export async function registerUser(body: MockRegisterInput) {
  await delay()
  registerCounter += 1
  const user: MockAuthUser = {
    id: registerCounter,
    name: body.name,
    email: body.email,
    phone: body.phone,
  }
  return { message: 'Cadastro realizado com sucesso', data: user }
}
