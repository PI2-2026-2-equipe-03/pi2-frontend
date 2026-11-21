import Axios from 'axios'
import { RefreshCw } from 'lucide-react'

import { EmptyState } from '@/components/empty-state'
import type { IlustracaoNome } from '@/components/ilustracao'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage, isForbiddenError } from '@/lib/errors'
import { cn } from '@/lib/utils'

type QueryErrorStateProps = {
  title: string
  error: unknown
  onRetry: () => void
  isRetrying?: boolean
}

// a cena acompanha o tipo de falha: rede, servidor, permissão, sessão ou genérica
function ilustracaoDoErro(error: unknown): IlustracaoNome {
  if (isForbiddenError(error)) return 'acesso-negado'
  if (!Axios.isAxiosError(error)) return 'bola-na-rede'
  if (!error.response) return 'sem-conexao'
  if (error.response.status === 401) return 'sessao-expirada'
  if (error.response.status >= 500) return 'erro-servidor'
  return 'bola-na-rede'
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
      ilustracao={ilustracaoDoErro(error)}
      title={title}
      description={getApiErrorMessage(
        error,
        'Confira se a API está no ar e tente novamente.',
      )}
      // tentar de novo não muda a permissão de ninguém
      action={
        isForbiddenError(error) ? undefined : (
          <Button
            variant="brandOutline"
            onClick={onRetry}
            disabled={isRetrying}
            aria-busy={isRetrying}
          >
            <RefreshCw className={cn('size-4', isRetrying && 'animate-spin')} />
            Tentar novamente
          </Button>
        )
      }
    />
  )
}
