import { QueryClient } from '@tanstack/react-query'

// cache de 5 min alinhado com o rnf-03 (resposta rápida)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 3,
    },
    mutations: {
      retry: 1,
    },
  },
})
