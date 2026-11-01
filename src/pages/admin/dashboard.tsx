import {
  Activity,
  Clock,
  LayoutGrid,
  Megaphone,
  RefreshCw,
  Users,
  Video,
} from 'lucide-react'
import { toast } from 'sonner'

import { QueryErrorState } from '@/components/query-error-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { AdminMetricsDto, ManagerMetricsDto } from '@/lib/api/metrics'
import {
  useAdminMetrics,
  useCurrentUser,
  useManagerMetrics,
} from '@/lib/api/queries'
import { cn } from '@/lib/utils'
import { RankingChart } from '@/pages/admin/components/ranking-chart'
import { StatCard } from '@/pages/admin/components/stat-card'

function formatAccesses(value: number) {
  return `${value} ${value === 1 ? 'acesso' : 'acessos'}`
}

function formatReplays(value: number) {
  return `${value} ${value === 1 ? 'replay' : 'replays'}`
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-8">
      <span className="sr-only">Carregando…</span>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </section>
      <Skeleton className="h-56 rounded-xl" />
    </div>
  )
}

function AdminOverview({ metrics }: { metrics: AdminMetricsDto }) {
  return (
    <>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Usuários ativos"
          value={metrics.activeUsers}
          hint="com sessão válida agora"
          icon={Users}
        />
        <StatCard
          title="Quadras"
          value={metrics.totalCourts}
          icon={LayoutGrid}
        />
        <StatCard
          title="Replays ativos"
          value={metrics.totalReplays}
          hint="ainda não expirados"
          icon={Video}
        />
      </section>

      <RankingChart
        icon={Activity}
        title="Quadras mais acessadas"
        description="As 5 quadras com mais downloads de replays."
        emptyMessage="Nenhum replay foi baixado até agora."
        items={metrics.mostAccessedCourts.map((court) => ({
          id: court.courtId,
          label: court.name,
          value: court.accesses,
        }))}
        formatValue={formatAccesses}
      />
    </>
  )
}

function ManagerOverview({ metrics }: { metrics: ManagerMetricsDto }) {
  return (
    <>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Replays ativos"
          value={metrics.totalReplays}
          hint="ainda não expirados"
          icon={Video}
        />
        <StatCard
          title="Patrocinadores"
          value={metrics.totalSponsors}
          icon={Megaphone}
        />
        <StatCard
          title="Quadras"
          value={metrics.courts.length}
          icon={LayoutGrid}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RankingChart
          icon={Activity}
          title="Replays por quadra"
          description="Replays ativos em cada uma das suas quadras."
          emptyMessage="Você ainda não tem quadras cadastradas."
          items={metrics.courts.map((court) => ({
            id: court.id,
            label: court.name,
            value: court.replays,
          }))}
          formatValue={formatReplays}
        />
        <RankingChart
          icon={Clock}
          title="Horários de pico"
          description="Os 5 horários com mais downloads nas suas quadras."
          emptyMessage="Nenhum replay das suas quadras foi baixado até agora."
          items={metrics.peakHours.map((peak) => ({
            id: peak.hour,
            label: peak.hour,
            value: peak.accesses,
          }))}
          formatValue={formatAccesses}
        />
      </section>
    </>
  )
}

// tela dashboard — métricas do perfil logado. o guard de /admin garante o perfil
// antes de montar a tela, então só a query do perfil certo é disparada.
export function Dashboard() {
  const { data: currentUser } = useCurrentUser()
  const isAdmin = currentUser?.role === 'ADM'
  const adminMetrics = useAdminMetrics(isAdmin)
  const managerMetrics = useManagerMetrics(currentUser?.role === 'CLI')
  const metrics = isAdmin ? adminMetrics : managerMetrics

  async function handleRefresh() {
    const result = await metrics.refetch()
    if (result.isSuccess) {
      toast.success('Dados atualizados', {
        description: 'Painel sincronizado com o servidor.',
      })
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
            {isAdmin ? 'Painel administrativo' : 'Painel do gestor'}
          </h1>
          <p className="text-tg-brand-blue font-medium">
            {isAdmin
              ? 'Visão geral do sistema TaGravado'
              : 'Visão geral das suas quadras'}
          </p>
        </div>
        <Button
          variant="brandOutline"
          disabled={metrics.isFetching}
          aria-busy={metrics.isFetching}
          onClick={() => void handleRefresh()}
        >
          <RefreshCw
            className={cn('size-4', metrics.isFetching && 'animate-spin')}
          />
          Atualizar
        </Button>
      </header>

      {metrics.isPending ? (
        <DashboardSkeleton />
      ) : metrics.isError ? (
        <QueryErrorState
          title="Não foi possível carregar as métricas"
          error={metrics.error}
          onRetry={() => void metrics.refetch()}
          isRetrying={metrics.isFetching}
        />
      ) : isAdmin && adminMetrics.data ? (
        <AdminOverview metrics={adminMetrics.data} />
      ) : managerMetrics.data ? (
        <ManagerOverview metrics={managerMetrics.data} />
      ) : null}
    </div>
  )
}
