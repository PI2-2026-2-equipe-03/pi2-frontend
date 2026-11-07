import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import { RouterProvider } from 'react-router-dom'

import { ForbiddenDialog } from '@/components/forbidden-dialog'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from '@/lib/react-query'
import { router } from '@/routes'

// providers globais, a ordem importa: theme > query > tooltip > router
export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MotionConfig reducedMotion="user">
            <RouterProvider router={router} />
            <ForbiddenDialog />
            <Toaster position="top-right" richColors closeButton expand />
          </MotionConfig>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
