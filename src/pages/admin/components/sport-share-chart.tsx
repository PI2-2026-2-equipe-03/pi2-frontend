import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { useMemo } from 'react'

import type { Sport } from '@/lib/mocks'
import { SPORT_LABEL } from '@/lib/mocks'
import { motionTokens, useMotionSafe } from '@/lib/motion'

type SportShare = {
  esporte: Sport
  value: number
}

type SportShareChartProps = {
  data: readonly SportShare[]
}

const SPORT_COLOR: Record<Sport, string> = {
  volei: 'bg-chart-1',
  futebol: 'bg-chart-2',
  tenis: 'bg-chart-3',
  padel: 'bg-chart-4',
}

// barras horizontais mostrando participação de cada esporte
export function SportShareChart({ data }: SportShareChartProps) {
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
          Replays por esporte
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Distribuição percentual dos replays gerados.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {data.map((item, index) => {
          const pct = (item.value / total) * 100
          return (
            <li key={item.esporte}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-foreground font-medium">
                  {SPORT_LABEL[item.esporte]}
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
                  className={`h-full ${SPORT_COLOR[item.esporte]}`}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
