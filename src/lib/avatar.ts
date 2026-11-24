import type { UserRole } from '@/lib/types'

// a "galera da quadra": avatares da marca em public/avatares (gerados em marca/fonte/gerar_avatares.py).
// o banco não guarda foto de perfil, então cada usuário ganha um destes, sempre o mesmo.
export const AVATARES = [
  'saque',
  'sol',
  'rec',
  'botao',
  'apito',
  'claquete',
  'ampulheta',
  'taca',
  'tenis',
  'coco',
  'placar',
  'pipoca',
] as const

export type AvatarNome = (typeof AVATARES)[number]

export const AVATAR_ROTULOS: Record<AvatarNome, string> = {
  saque: 'Saque',
  sol: 'Sol',
  rec: 'Rec',
  botao: 'Botão',
  apito: 'Apito',
  claquete: 'Claquete',
  ampulheta: 'Ampulheta',
  taca: 'Taça',
  tenis: 'Tênis',
  coco: 'Coco',
  placar: 'Placar',
  pipoca: 'Pipoca',
}

// FNV-1a de 32 bits: sem dependência e espalha bem tanto UUID quanto nome.
// a mesma chave sempre cai no mesmo avatar, em qualquer tela e em qualquer aparelho.
export function avatarDaChave(chave: string): AvatarNome {
  let h = 0x811c9dc5
  for (let i = 0; i < chave.length; i++) {
    h ^= chave.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return AVATARES[(h >>> 0) % AVATARES.length]
}

export type UsuarioAvatar = {
  id?: string | number | null
  email?: string | null
  name?: string | null
  role?: UserRole | null
}

// a chave é o id: nunca muda, então o avatar não troca se a pessoa editar o nome.
// sem id (ou o "0" dos mocks), cai para e-mail e depois nome.
export function avatarDoUsuario(usuario: UsuarioAvatar): AvatarNome {
  const id = usuario.id == null ? '' : String(usuario.id)
  const chave =
    id && id !== '0' ? id : (usuario.email ?? usuario.name ?? '').trim()
  return avatarDaChave(chave.toLowerCase())
}
