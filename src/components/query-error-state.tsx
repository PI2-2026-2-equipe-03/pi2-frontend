import { RefreshCw, WifiOff } from 'lucide-react'

import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/errors'

type QueryErrorStateProps = {
  title: string
  error: unknown
  onRetry: () => void
}

// estado de erro padrão das listagens: mensagem da api (ou fallback) + retry
export function QueryErrorState({
  title,
  error,
  onRetry,
}: QueryErrorStateProps) {
  return (
    <EmptyState
      icon={WifiOff}
      title={title}
      description={getApiErrorMessage(
        error,
        'Confira se a API está no ar e tente novamente.',
      )}
      action={
        <Button variant="brandOutline" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Tentar novamente
        </Button>
      }
    />
  )
}
