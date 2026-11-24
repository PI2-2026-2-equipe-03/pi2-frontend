import { AlertTriangle, RefreshCw } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { Button } from '@/components/ui/button'

// route-level error element: renders inside the nearest outlet when a lazy
// chunk fails to load or any route error occurs
export function RouteErrorElement() {
  const error = useRouteError()

  const isChunkLoadError =
    error instanceof Error &&
    (error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Loading CSS chunk'))

  const handleRefresh = (): void => {
    window.location.reload()
  }

  return (
    <div className="bg-background text-foreground flex min-h-svh items-center justify-center p-4">
      <div className="max-w-sm space-y-4 text-center">
        <AlertTriangle className="text-destructive mx-auto h-12 w-12" />
        <h2 className="text-xl font-semibold">
          {isChunkLoadError ? 'Atualização disponível' : 'Algo deu errado'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {isChunkLoadError
            ? 'Uma nova versão do app foi publicada. Clique para recarregar.'
            : isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}: ${error.data}`
              : error instanceof Error
                ? error.message
                : 'Ocorreu um erro inesperado. Tente recarregar a página.'}
        </p>
        <Button onClick={handleRefresh} className="gap-2">
          <RefreshCw className="size-4 md:size-5" />
          Recarregar
        </Button>
      </div>
    </div>
  )
}
