import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { useMemo } from 'react'

import { motionTokens, useMotionSafe } from '@/lib/motion'

type ArenaShare = {
  arenaId: number
  arenaNome: string
  value: number
}

type ArenaShareChartProps = {
  data: readonly ArenaShare[]
}

const BAR_COLORS = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
] as const

export function ArenaShareChart({ data }: ArenaShareChartProps) {
  const { shouldReduce } = useMotionSafe()
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0) || 1,
    [data],
  )

  return (
    <section className="bg-card border-border rounded-xl border p-5 md:p-6">
      <header className="mb-4">
        <h2 className="text-tg-brand-blue flex items-center gap-2 text-lg font-bold">
          <Activity className="size-5" />
          Replays por arena
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Distribuição dos replays gerados entre as arenas da plataforma.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {data.map((item, index) => {
          const pct = (item.value / total) * 100
          return (
            <li key={item.arenaId}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-foreground font-medium">
                  {item.arenaNome}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {item.value} ({pct.toFixed(0)}%)
                </span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <motion.div
                  initial={shouldReduce ? { width: `${pct}%` } : { width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: motionTokens.durations.slow,
                    delay: shouldReduce ? 0 : index * 0.08,
                    ease: motionTokens.ease.out,
                  }}
                  className={`h-full ${BAR_COLORS[index % BAR_COLORS.length]}`}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
