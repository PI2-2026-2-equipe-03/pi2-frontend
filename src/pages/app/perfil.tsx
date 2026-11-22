import { ChevronRight, Mail, ShieldCheck, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AvatarUsuario } from '@/components/avatar-usuario'
import {
  APP_SECONDARY_ITEMS,
  visibleNavItems,
} from '@/components/navigation/nav-items'
import { QueryErrorState } from '@/components/query-error-state'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/lib/api/queries'
import type { UserRole } from '@/lib/types'

import { ChangePasswordDialog } from './components/change-password-dialog'

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

// tela de perfil, dados de GET /me
export function Perfil() {
  const currentUser = useCurrentUser()
  const secondaryItems = visibleNavItems(
    APP_SECONDARY_ITEMS,
    currentUser.data?.role,
  )

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-tg-brand-text text-2xl font-bold md:text-3xl">
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
          <div className="flex items-center gap-4">
            <AvatarUsuario
              usuario={currentUser.data}
              className="size-16 md:size-20"
            />
            <div className="min-w-0">
              <p className="text-lg font-bold break-words md:text-xl">
                {currentUser.data.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {ROLE_LABELS[currentUser.data.role]}
              </p>
            </div>
          </div>
          <dl className="grid gap-4">
            <div className="flex items-start gap-3">
              <User className="text-tg-brand-text mt-0.5 size-5 shrink-0" />
              <div className="min-w-0">
                <dt className="text-muted-foreground text-sm">Nome</dt>
                <dd className="font-medium break-words">
                  {currentUser.data.name}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-tg-brand-text mt-0.5 size-5 shrink-0" />
              <div className="min-w-0">
                <dt className="text-muted-foreground text-sm">E-mail</dt>
                <dd className="font-medium break-words">
                  {currentUser.data.email}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-tg-brand-text mt-0.5 size-5 shrink-0" />
              <div className="min-w-0">
                <dt className="text-muted-foreground text-sm">Perfil</dt>
                <dd className="font-medium">
                  {ROLE_LABELS[currentUser.data.role]}
                </dd>
              </div>
            </div>
          </dl>

          <ChangePasswordDialog />
        </Card>
      )}

      {/* d-01 moved Quadras, Solicitar gestão and Gestão out of the bottom
          tabs, so the profile is the way to them. the list is derived from the
          shared nav items, not retyped */}
      {secondaryItems.length > 0 ? (
        <Card className="gap-1 p-2">
          <h2 className="text-muted-foreground px-3 pt-1 text-sm font-medium">
            Outras seções
          </h2>
          <nav aria-label="Outras seções" className="flex flex-col">
            {secondaryItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-tg-brand-yellow/60 min-h-touch-min flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Icon className="text-tg-brand-text size-5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="text-muted-foreground size-4 shrink-0" />
                </Link>
              )
            })}
          </nav>
        </Card>
      ) : null}
    </div>
  )
}
