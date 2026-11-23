import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { ForbiddenDialog } from '@/components/forbidden-dialog'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/react-query'
import { router } from '@/routes'

// providers globais, a ordem importa: theme > query > router. motion and
// tooltip providers live in the app/admin layouts so auth never loads them
export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ForbiddenDialog />
        <Toaster position="top-right" richColors closeButton expand />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
