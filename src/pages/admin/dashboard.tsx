import { Camera, LayoutGrid, RefreshCw, Users, Video } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { HourlyChart } from '@/pages/admin/components/hourly-chart'
import { RecentActivity } from '@/pages/admin/components/recent-activity'
import { ReplaysChart } from '@/pages/admin/components/replays-chart'
import { SportShareChart } from '@/pages/admin/components/sport-share-chart'
import { StatCard } from '@/pages/admin/components/stat-card'

// mock local — kpis do painel enquanto a api não existe
const KPI_CARDS = [
  {
    title: 'Replays hoje',
    value: 24,
    hint: '+12 % em relação a ontem',
    hintVariant: 'success' as const,
    icon: Video,
  },
  {
    title: 'Quadras',
    value: 4,
    hint: 'todas ativas',
    hintVariant: 'muted' as const,
    icon: LayoutGrid,
  },
  {
    title: 'Usuários',
    value: 130,
    hint: '+8 % em relação a ontem',
    hintVariant: 'success' as const,
    icon: Users,
  },
  {
    title: 'Câmeras ativas',
    value: 4,
    icon: Camera,
  },
]

const REPLAYS_POR_DIA = [
  { date: '19/09', value: 8 },
  { date: '20/09', value: 12 },
  { date: '21/09', value: 15 },
  { date: '22/09', value: 18 },
  { date: '23/09', value: 22 },
  { date: '24/09', value: 26 },
  { date: '25/09', value: 32 },
]

const USO_POR_HORA = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  value: Math.max(
    1,
    Math.round(
      12 * Math.exp(-((hour - 19) ** 2) / 22) +
        6 * Math.exp(-((hour - 10) ** 2) / 14),
    ),
  ),
}))

const REPLAYS_POR_ESPORTE = [
  { esporte: 'volei' as const, value: 42 },
  { esporte: 'futebol' as const, value: 33 },
  { esporte: 'tenis' as const, value: 18 },
  { esporte: 'padel' as const, value: 12 },
]

// tela dashboard — painel administrativo (fluxo admin)
export function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  function handleRefresh() {
    setRefreshKey((n) => n + 1)
    toast.success('Dados atualizados', {
      description: 'Painel sincronizado com o servidor.',
    })
  }

  return (
    <div key={refreshKey} className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
            Painel administrativo
          </h1>
          <p className="text-tg-brand-blue font-medium">
            Visão geral do sistema TaGravado
          </p>
        </div>
        <Button variant="brandOutline" onClick={handleRefresh}>
          <RefreshCw className="size-4" />
          Atualizar
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <ReplaysChart data={REPLAYS_POR_DIA} />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HourlyChart data={USO_POR_HORA} />
        <SportShareChart data={REPLAYS_POR_ESPORTE} />
      </section>

      <RecentActivity />
    </div>
  )
}
