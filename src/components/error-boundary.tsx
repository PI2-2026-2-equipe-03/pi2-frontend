import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRefresh = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isChunkLoadError =
        this.state.error?.message.includes(
          'Failed to fetch dynamically imported module',
        ) ||
        this.state.error?.message.includes('Loading chunk') ||
        this.state.error?.message.includes('Loading CSS chunk')

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
                : 'Ocorreu um erro inesperado. Tente recarregar a página.'}
            </p>
            <Button onClick={this.handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Recarregar
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
