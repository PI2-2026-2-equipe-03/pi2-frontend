// busca unificada: a query casa contra nome da quadra, da arena ou da cidade.
// o resultado SEMPRE é uma lista de quadras (ou de arenas no suggestArenas),
// com prioridade quadra > arena > cidade quando o termo é ambíguo.
// módulo puro — a fonte de dados entra por parâmetro (default: mocks, usados
// pela home enquanto ela não é integrada).

import { ARENAS, getArenaById, QUADRAS } from '@/lib/mocks'
import type { Arena, Quadra } from '@/lib/types'

export type CourtMatch = {
  quadra: Pick<Quadra, 'id' | 'nome'>
  arena: Pick<Arena, 'id' | 'nome' | 'cidade' | 'fotoUrl'>
}

export type Suggestion = {
  id: string
  label: string
  subtitle?: string
  payload:
    | { kind: 'court'; value: number | string }
    | { kind: 'arena'; value: number | string }
}

type CourtMatchKind = 'court' | 'arena' | 'city'
type ArenaMatchKind = 'name' | 'city'

const COURT_PRIORITY: Record<CourtMatchKind, number> = {
  court: 0,
  arena: 1,
  city: 2,
}

const ARENA_PRIORITY: Record<ArenaMatchKind, number> = {
  name: 0,
  city: 1,
}

const MOCK_COURTS: readonly CourtMatch[] = QUADRAS.flatMap((quadra) => {
  const arena = getArenaById(quadra.arenaId)
  return arena ? [{ quadra, arena }] : []
})

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export async function suggestCourts(
  rawQuery: string,
  courts: readonly CourtMatch[] = MOCK_COURTS,
): Promise<CourtMatch[]> {
  const q = normalize(rawQuery)
  if (!q) return []

  const scored: Array<CourtMatch & { matchedBy: CourtMatchKind }> = []

  for (const { quadra, arena } of courts) {
    let matchedBy: CourtMatchKind | null = null
    if (normalize(quadra.nome).includes(q)) matchedBy = 'court'
    else if (normalize(arena.nome).includes(q)) matchedBy = 'arena'
    else if (normalize(arena.cidade).includes(q)) matchedBy = 'city'
    if (matchedBy) scored.push({ quadra, arena, matchedBy })
  }

  scored.sort((a, b) => {
    const p = COURT_PRIORITY[a.matchedBy] - COURT_PRIORITY[b.matchedBy]
    if (p !== 0) return p
    return a.quadra.nome.localeCompare(b.quadra.nome, 'pt-BR')
  })

  return scored.map(({ quadra, arena }) => ({ quadra, arena }))
}

export async function suggestArenas(
  rawQuery: string,
  arenas: readonly Arena[] = ARENAS,
): Promise<Arena[]> {
  const q = normalize(rawQuery)
  if (!q) return []

  const scored: Array<{ arena: Arena; matchedBy: ArenaMatchKind }> = []

  for (const arena of arenas) {
    let matchedBy: ArenaMatchKind | null = null
    if (normalize(arena.nome).includes(q)) matchedBy = 'name'
    else if (normalize(arena.cidade).includes(q)) matchedBy = 'city'
    if (matchedBy) scored.push({ arena, matchedBy })
  }

  scored.sort((a, b) => {
    const p = ARENA_PRIORITY[a.matchedBy] - ARENA_PRIORITY[b.matchedBy]
    if (p !== 0) return p
    return a.arena.nome.localeCompare(b.arena.nome, 'pt-BR')
  })

  return scored.map((m) => m.arena)
}

// adaptadores pro SearchCombobox: transformam o shape de match em Suggestion.
// `subtitle` é o único campo que carrega contexto adicional (Arena · Cidade).
// nenhum campo expõe pro UI qual critério bateu — o fallback é implícito.

export async function courtSuggestions(
  query: string,
  courts?: readonly CourtMatch[],
): Promise<Suggestion[]> {
  const matches = await suggestCourts(query, courts)
  return matches.map(({ quadra, arena }) => ({
    id: `court-${quadra.id}`,
    label: quadra.nome,
    subtitle: [arena.nome, arena.cidade].filter(Boolean).join(' · '),
    payload: { kind: 'court', value: quadra.id },
  }))
}

export async function arenaSuggestions(
  query: string,
  arenas?: readonly Arena[],
): Promise<Suggestion[]> {
  const matches = await suggestArenas(query, arenas)
  return matches.map((arena) => ({
    id: `arena-${arena.id}`,
    label: arena.nome,
    subtitle: arena.cidade,
    payload: { kind: 'arena', value: arena.id },
  }))
}
