// ponto único de leitura de cada domínio. as telas consomem estes hooks em vez
// de montar useQuery à mão — assim ligar um endpoint novo não deixa consumidor
// para trás, e nenhuma página precisa saber do toggle de mocks.
import { useQuery } from '@tanstack/react-query'

import { listArenas } from '@/lib/api/arenas'
import { toArena, toQuadra, toReplayView } from '@/lib/api/mappers'
import { listQuadras } from '@/lib/api/quadras'
import { listReplays } from '@/lib/api/replays'
import type { Arena, Id, Quadra, ReplayView } from '@/lib/types'

export const queryKeys = {
  arenas: ['arenas'] as const,
  quadras: ['quadras'] as const,
  replays: ['replays'] as const,
}

export function useArenas() {
  return useQuery({
    queryKey: queryKeys.arenas,
    queryFn: listArenas,
    select: (response): Arena[] => response.data.map(toArena),
  })
}

export function useQuadras() {
  return useQuery({
    queryKey: queryKeys.quadras,
    queryFn: listQuadras,
    select: (response): Quadra[] => response.data.map(toQuadra),
  })
}

export function useReplays() {
  return useQuery({
    queryKey: queryKeys.replays,
    queryFn: listReplays,
    select: (response): ReplayView[] => response.data.map(toReplayView),
  })
}

// não existe GET /cidades ainda; a lista sai das arenas, deduplicada e ordenada.
// quando o endpoint existir, só esta função muda.
export function citiesFromArenas(arenas: readonly Arena[]): string[] {
  const unique = new Set<string>()
  for (const arena of arenas) {
    const city = arena.cidade?.trim()
    if (city) unique.add(city)
  }
  return [...unique].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function indexById<T extends { id: Id }>(
  items: readonly T[],
): Map<Id, T> {
  return new Map(items.map((item) => [item.id, item]))
}
