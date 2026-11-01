// ponto único de leitura de cada domínio. as telas consomem estes hooks em vez
// de montar useQuery à mão — assim ligar um endpoint novo não deixa consumidor
// para trás, e nenhuma página precisa saber do toggle de mocks.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { listArenas } from '@/lib/api/arenas'
import { deleteCamera, listCameras } from '@/lib/api/cameras'
import {
  toArena,
  toCamera,
  toPatrocinador,
  toQuadra,
  toReplayView,
} from '@/lib/api/mappers'
import { getMe } from '@/lib/api/me'
import {
  deletePatrocinador,
  listPatrocinadores,
} from '@/lib/api/patrocinadores'
import { deleteQuadra, listQuadras } from '@/lib/api/quadras'
import { listReplays } from '@/lib/api/replays'
import type {
  Arena,
  Camera,
  Id,
  PatrocinadorView,
  Quadra,
  ReplayView,
} from '@/lib/types'

export const queryKeys = {
  me: ['me'] as const,
  arenas: ['arenas'] as const,
  quadras: ['quadras'] as const,
  cameras: ['cameras'] as const,
  patrocinadores: ['patrocinadores'] as const,
  replays: ['replays'] as const,
}

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    enabled,
    select: (response) => response.data,
  })
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

export function useCameras() {
  return useQuery({
    queryKey: queryKeys.cameras,
    queryFn: listCameras,
    select: (response): Camera[] => response.data.map(toCamera),
  })
}

export function usePatrocinadores() {
  return useQuery({
    queryKey: queryKeys.patrocinadores,
    queryFn: listPatrocinadores,
    select: (response): PatrocinadorView[] => response.data.map(toPatrocinador),
  })
}

export function useReplays() {
  return useQuery({
    queryKey: queryKeys.replays,
    queryFn: listReplays,
    select: (response): ReplayView[] => response.data.map(toReplayView),
  })
}

// onSuccess devolve a promise do refetch: a mutation só termina quando a
// lista já voltou sem o item, então o modal não fecha mostrando a linha antiga.
export function useDeleteQuadra() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => deleteQuadra(id),
    // o cascade do banco leva junto câmeras, vínculos de patrocínio e replays
    onSuccess: () =>
      Promise.all(
        [
          queryKeys.quadras,
          queryKeys.cameras,
          queryKeys.patrocinadores,
          queryKeys.replays,
        ].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
      ),
  })
}

export function useDeleteCamera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => deleteCamera(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.cameras }),
  })
}

export function useDeletePatrocinador() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => deletePatrocinador(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.patrocinadores }),
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
