import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { ForbiddenDialog } from '@/components/forbidden-dialog'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/react-query'
import { DESKTOP_QUERY, useMediaQuery } from '@/lib/use-media-query'
import { router } from '@/routes'

// sonner adds no safe area of its own; 24px/16px are its default offsets.
// --tg-toast-lift clears the bottom nav or the sticky action bar (style.css)
const TOAST_OFFSET = {
  bottom: 'calc(24px + var(--tg-toast-lift, 0px) + var(--tg-safe-area-bottom))',
}
const TOAST_MOBILE_OFFSET = {
  bottom: 'calc(16px + var(--tg-toast-lift, 0px) + var(--tg-safe-area-bottom))',
}

// providers globais, a ordem importa: theme > query > router. motion and
// tooltip providers live in the app/admin layouts so auth never loads them
export function App() {
  // on phones the toasts go near the thumb, away from the sticky header and
  // the camera cutout; desktop keeps the corner
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ForbiddenDialog />
        <Toaster
          position={isDesktop ? 'top-right' : 'bottom-center'}
          offset={TOAST_OFFSET}
          mobileOffset={TOAST_MOBILE_OFFSET}
          richColors
          closeButton
          expand
        />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
