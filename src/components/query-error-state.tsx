import { RefreshCw, WifiOff } from 'lucide-react'

import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'

type QueryErrorStateProps = {
  title: string
  error: unknown
  onRetry: () => void
  isRetrying?: boolean
}

// estado de erro padrão das listagens: mensagem da api (ou fallback) + retry
export function QueryErrorState({
  title,
  error,
  onRetry,
  isRetrying = false,
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
        <Button
          variant="brandOutline"
          onClick={onRetry}
          disabled={isRetrying}
          aria-busy={isRetrying}
        >
          <RefreshCw className={cn('size-4', isRetrying && 'animate-spin')} />
          Tentar novamente
        </Button>
      }
    />
  )
}
