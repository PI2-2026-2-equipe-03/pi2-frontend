import { QueryClient } from '@tanstack/react-query'

import { isClientError } from '@/lib/errors'

// erro 4xx não se resolve repetindo: só atrasaria o tratamento de 401/403 e
// reenviaria mutations recusadas.
function retryUpTo(limit: number) {
  return (failureCount: number, error: unknown) =>
    !isClientError(error) && failureCount < limit
}

// cache de 5 min alinhado com o rnf-03 (resposta rápida)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: retryUpTo(3),
    },
    mutations: {
      retry: retryUpTo(1),
    },
  },
})
