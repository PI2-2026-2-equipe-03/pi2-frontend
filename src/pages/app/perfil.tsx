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

// same card as the loaded profile: avatar + name/role, three icon rows and
// the change-password button
function ProfileSkeleton() {
  return (
    <Card role="status" aria-busy="true" className="gap-5 p-5 md:p-6">
      <span className="sr-only">Carregando seu perfil…</span>
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 shrink-0 rounded-full md:size-20" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-2/3 md:h-6" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-start gap-3">
            <Skeleton className="mt-0.5 size-5 shrink-0" />
            <div className="flex flex-1 flex-col">
              <div className="flex h-5 items-center">
                <Skeleton className="h-3.5 w-12" />
              </div>
              <div className="flex h-6 items-center">
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full sm:w-32 md:h-9" />
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
