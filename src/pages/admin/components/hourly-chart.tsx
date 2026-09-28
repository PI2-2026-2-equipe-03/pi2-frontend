import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useMemo } from 'react'

import { motionTokens, useMotionSafe } from '@/lib/motion'

type HourValue = {
  hour: number
  value: number
}

type HourlyChartProps = {
  data: readonly HourValue[]
}

// gráfico de uso por hora — 24 barras compactas verticais
export function HourlyChart({ data }: HourlyChartProps) {
  const { shouldReduce } = useMotionSafe()
  const max = useMemo(
    () => Math.max(...data.map((d) => d.value), 1),
    [data],
  )

  return (
    <section className="bg-card border-border rounded-xl border p-5 md:p-6">
      <header className="mb-4">
        <h2 className="text-tg-brand-blue flex items-center gap-2 text-lg font-bold">
          <Clock className="size-5" />
          Uso por hora
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Distribuição das gravações ao longo do dia.
        </p>
      </header>

      <div className="flex h-32 items-end gap-1">
        {data.map((hour, index) => {
          const barPct = `${(hour.value / max) * 100}%`
          return (
            <motion.div
              key={hour.hour}
              initial={shouldReduce ? { height: barPct } : { height: 0 }}
              animate={{ height: barPct }}
              transition={{
                duration: motionTokens.durations.base,
                delay: shouldReduce ? 0 : index * 0.015,
                ease: motionTokens.ease.out,
              }}
              className="bg-chart-2 hover:bg-tg-brand-blue min-h-0.5 flex-1 origin-bottom rounded-sm transition-colors"
              title={`${hour.hour}h — ${hour.value} replays`}
            />
          )
        })}
      </div>

      <div className="text-muted-foreground mt-2 flex justify-between text-xs tabular-nums">
        <span>0h</span>
        <span>6h</span>
        <span>12h</span>
        <span>18h</span>
        <span>23h</span>
      </div>
    </section>
  )
}
