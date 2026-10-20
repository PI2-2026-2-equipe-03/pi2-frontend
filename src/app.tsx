import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import { RouterProvider } from 'react-router-dom'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from '@/lib/react-query'
import { router } from '@/routes'

// providers globais — ordem importa (theme → query → tooltip → router)
// MotionConfig reducedMotion="user" respeita prefers-reduced-motion do SO
// em toda animação framer-motion sem precisar gatear por componente.
export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MotionConfig reducedMotion="user">
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors closeButton expand />
          </MotionConfig>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
