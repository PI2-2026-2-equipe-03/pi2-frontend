import { Camera, LayoutGrid, Users, Video } from 'lucide-react'

import { ReplaysChart } from '@/pages/admin/components/replays-chart'
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

// tela dashboard — painel administrativo (fluxo admin)
export function Dashboard() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header>
        <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
          Painel administrativo
        </h1>
        <p className="text-tg-brand-blue font-medium">
          Visão geral do sistema TaGravado
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <ReplaysChart data={REPLAYS_POR_DIA} />
    </div>
  )
}
