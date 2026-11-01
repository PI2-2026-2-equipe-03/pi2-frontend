import { ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/empty-state'
import { QueryErrorState } from '@/components/query-error-state'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/lib/api/queries'
import { useSessionGuard } from '@/lib/auth/session'
import { FORBIDDEN_MESSAGE } from '@/lib/errors'
import type { UserRole } from '@/lib/types'

type RequireRoleProps = {
  roles: readonly UserRole[]
  children: ReactNode
}

function GuardScreen({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-svh items-center justify-center p-4">
      {children}
    </div>
  )
}

// só adapta a interface: quem autoriza de verdade é o backend, em cada rota.
// na dúvida nega: sem perfil confirmado, o conteúdo protegido não é montado.
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { data: session, isPending } = useSessionGuard()
  const currentUser = useCurrentUser(Boolean(session))

  if (isPending || !session || currentUser.isPending) return null

  if (currentUser.isError) {
    return (
      <GuardScreen>
        <QueryErrorState
          title="Não foi possível verificar seu acesso"
          error={currentUser.error}
          onRetry={() => void currentUser.refetch()}
          isRetrying={currentUser.isFetching}
        />
      </GuardScreen>
    )
  }

  if (!roles.includes(currentUser.data.role)) {
    return (
      <GuardScreen>
        <EmptyState
          icon={ShieldAlert}
          title="Acesso não permitido"
          description={FORBIDDEN_MESSAGE}
          action={
            <Button asChild variant="brandOutline">
              <Link to="/app">Voltar para o início</Link>
            </Button>
          }
        />
      </GuardScreen>
    )
  }

  return children
}
