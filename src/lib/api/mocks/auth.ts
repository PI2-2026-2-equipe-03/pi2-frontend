// mocks locais para auth, ativados por VITE_USE_MOCKS=true em @/lib/api/auth.
// as respostas imitam as rotas /auth/* do backend, sem envelope { data }.
import type {
  ForgotPasswordBody,
  LoginBody,
  LoginResponse,
  MessageResponse,
  RegisterBody,
  RegisterResponse,
} from '@/lib/api/auth'
import type { CurrentUserDto } from '@/lib/api/me'
import { getMockSession, saveMockSession } from '@/lib/auth/session'
import type { UserRole } from '@/lib/types'

const MOCK_DELAY_MS = 400

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

const MOCK_TOKEN = 'mock-token'
const MOCK_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

let registerCounter = 1000

// permite testar cada perfil sem backend: adm@… e cli@…; o resto é usuário comum
function mockRoleFor(email: string): UserRole {
  const normalized = email.trim().toLowerCase()
  if (normalized.startsWith('adm')) return 'ADM'
  if (normalized.startsWith('cli')) return 'CLI'
  return 'USR'
}

// nome derivado do e-mail para que a ui mostre quem entrou em vez de um rótulo fixo
function mockNameFor(email: string): string {
  const localPart = email.trim().split('@')[0] ?? ''
  const label = localPart.replace(/[._-]+/g, ' ').trim()
  if (!label) return 'Dev User'
  return label
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function loginUser(body: LoginBody): Promise<LoginResponse> {
  await delay()
  const user = {
    id: 'mock-user-1',
    name: mockNameFor(body.email),
    email: body.email,
    role: mockRoleFor(body.email),
  }
  // no modo real o backend responde com a cookie de sessão do Better Auth.
  // aqui o equivalente é gravar a sessão de mock que useAuthSession lê.
  saveMockSession({ ...user, token: MOCK_TOKEN })
  return { token: MOCK_TOKEN, expiresIn: MOCK_SESSION_TTL_SECONDS, user }
}

export async function registerUser(
  body: RegisterBody,
): Promise<RegisterResponse> {
  await delay()
  registerCounter += 1
  // cadastrar não autentica, igual ao backend: a tela manda para o login
  const now = new Date().toISOString()
  return {
    id: `mock-user-${registerCounter}`,
    name: body.name,
    email: body.email,
    emailVerified: false,
    image: null,
    createdAt: now,
    updatedAt: now,
    role: mockRoleFor(body.email),
  }
}

export async function forgotPassword(
  body: ForgotPasswordBody,
): Promise<MessageResponse> {
  await delay()
  return { message: `E-mail de recuperação enviado para ${body.email}` }
}

export async function resetPassword(): Promise<MessageResponse> {
  await delay()
  return { message: 'Senha redefinida com sucesso' }
}

export async function getMe(): Promise<{ data: CurrentUserDto }> {
  const session = getMockSession()
  return {
    data: {
      id: String(session?.id ?? 0),
      name: session?.name ?? 'Dev User',
      email: session?.email ?? '',
      role: session?.role ?? 'USR',
    },
  }
}
