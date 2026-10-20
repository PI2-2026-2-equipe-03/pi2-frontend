// busca unificada: a query casa contra nome da quadra, da arena ou da cidade.
// o resultado SEMPRE é uma lista de quadras (ou de arenas no suggestArenas),
// com prioridade quadra > arena > cidade quando o termo é ambíguo.
// módulo puro: recebe o dataset por parâmetro, não conhece a origem dos dados.

import type { Arena, Id, Quadra } from '@/lib/types'

export type CourtMatch = { quadra: Quadra; arena: Arena }

export type SearchDataset = {
  arenas: readonly Arena[]
  quadras: readonly Quadra[]
}

export type Suggestion = {
  id: string
  label: string
  subtitle?: string
  payload: { kind: 'court'; value: Id } | { kind: 'arena'; value: Id }
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

export function suggestCourts(
  { arenas, quadras }: SearchDataset,
  rawQuery: string,
): CourtMatch[] {
  const q = normalize(rawQuery)
  if (!q) return []

  const arenasById = new Map(arenas.map((arena) => [arena.id, arena]))

  const scored: Array<{
    quadra: Quadra
    arena: Arena
    matchedBy: CourtMatchKind
  }> = []

  for (const quadra of quadras) {
    const arena = arenasById.get(quadra.arenaId)
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

export function suggestArenas(
  arenas: readonly Arena[],
  rawQuery: string,
): Arena[] {
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

// fábricas de adaptador pro SearchCombobox, que espera
// `(query: string) => Promise<Suggestion[]>`. ligam o dataset vindo da API à
// assinatura assíncrona do componente.
// `subtitle` é o único campo que carrega contexto adicional (Arena · Cidade);
// nenhum campo expõe pro UI qual critério bateu — o fallback é implícito.

export function createCourtSuggestions(dataset: SearchDataset) {
  return async function courtSuggestions(query: string): Promise<Suggestion[]> {
    return suggestCourts(dataset, query).map(({ quadra, arena }) => ({
      id: `court-${quadra.id}`,
      label: quadra.nome,
      subtitle: `${arena.nome} · ${arena.cidade}`,
      payload: { kind: 'court', value: quadra.id },
    }))
  }
}

export function createArenaSuggestions(arenas: readonly Arena[]) {
  return async function arenaSuggestions(query: string): Promise<Suggestion[]> {
    return suggestArenas(arenas, query).map((arena) => ({
      id: `arena-${arena.id}`,
      label: arena.nome,
      subtitle: arena.cidade,
      payload: { kind: 'arena', value: arena.id },
    }))
  }
}
