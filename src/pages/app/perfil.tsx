import { Briefcase, Mail, ShieldCheck, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import { QueryErrorState } from '@/components/query-error-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/lib/api/queries'
import type { UserRole } from '@/lib/types'

const ROLE_LABELS: Record<UserRole, string> = {
  ADM: 'Administrador',
  CLI: 'Gestor de arena',
  USR: 'Usuário',
}

function ProfileSkeleton() {
  return (
    <Card role="status" aria-busy="true" className="gap-4 p-5 md:p-6">
      <span className="sr-only">Carregando…</span>
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </Card>
  )
}

// tela de perfil — dados de GET /me; o backend ainda não tem rota de edição
export function Perfil() {
  const currentUser = useCurrentUser()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
          Meu perfil
        </h1>
        <p className="text-muted-foreground">Os dados da sua conta</p>
      </header>

      {currentUser.isPending ? (
        <ProfileSkeleton />
      ) : currentUser.isError ? (
        <QueryErrorState
          title="Não foi possível carregar seu perfil"
          error={currentUser.error}
          onRetry={() => void currentUser.refetch()}
          isRetrying={currentUser.isFetching}
        />
      ) : (
        <Card className="gap-5 p-5 md:p-6">
          <dl className="grid gap-4">
            <div className="flex items-start gap-3">
              <User className="text-tg-brand-blue mt-0.5 size-5 shrink-0" />
              <div className="min-w-0">
                <dt className="text-muted-foreground text-sm">Nome</dt>
                <dd className="font-medium break-words">
                  {currentUser.data.name}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-tg-brand-blue mt-0.5 size-5 shrink-0" />
              <div className="min-w-0">
                <dt className="text-muted-foreground text-sm">E-mail</dt>
                <dd className="font-medium break-words">
                  {currentUser.data.email}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-tg-brand-blue mt-0.5 size-5 shrink-0" />
              <div className="min-w-0">
                <dt className="text-muted-foreground text-sm">Perfil</dt>
                <dd className="font-medium">
                  {ROLE_LABELS[currentUser.data.role]}
                </dd>
              </div>
            </div>
          </dl>

          {currentUser.data.role === 'USR' ? (
            <Button asChild variant="brandOutline" className="w-full sm:w-fit">
              <Link to="/app/solicitar-gestor">
                <Briefcase className="size-4" />
                Solicitar gestão de arena
              </Link>
            </Button>
          ) : null}
        </Card>
      )}
    </div>
  )
}
