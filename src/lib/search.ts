// busca unificada: a query casa contra nome da quadra, da arena ou da cidade.
// o resultado SEMPRE é uma lista de quadras (ou de arenas no suggestArenas),
// com prioridade quadra > arena > cidade quando o termo é ambíguo.
// módulo puro — testável quando o harness entrar.

import { ARENAS, getArenaById, QUADRAS } from '@/lib/mocks'
import type { Arena, Quadra } from '@/lib/types'

export type CourtMatch = { quadra: Quadra; arena: Arena }

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

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export async function suggestCourts(rawQuery: string): Promise<CourtMatch[]> {
  const q = normalize(rawQuery)
  if (!q) return []

  const scored: Array<{
    quadra: Quadra
    arena: Arena
    matchedBy: CourtMatchKind
  }> = []

  for (const quadra of QUADRAS) {
    const arena = getArenaById(quadra.arenaId)
    if (!arena) continue
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

export async function suggestArenas(rawQuery: string): Promise<Arena[]> {
  const q = normalize(rawQuery)
  if (!q) return []

  const scored: Array<{ arena: Arena; matchedBy: ArenaMatchKind }> = []

  for (const arena of ARENAS) {
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

export async function courtSuggestions(query: string): Promise<Suggestion[]> {
  const matches = await suggestCourts(query)
  return matches.map(({ quadra, arena }) => ({
    id: `court-${quadra.id}`,
    label: quadra.nome,
    subtitle: `${arena.nome} · ${arena.cidade}`,
    payload: { kind: 'court', value: quadra.id },
  }))
}

export async function arenaSuggestions(query: string): Promise<Suggestion[]> {
  const matches = await suggestArenas(query)
  return matches.map((arena) => ({
    id: `arena-${arena.id}`,
    label: arena.nome,
    subtitle: arena.cidade,
    payload: { kind: 'arena', value: arena.id },
  }))
}
