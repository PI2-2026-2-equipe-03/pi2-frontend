import { motion } from 'framer-motion'
import { ChartColumn } from 'lucide-react'
import { useMemo } from 'react'

import { motionTokens, useMotionSafe } from '@/lib/motion'

export type ReplayDay = {
  date: string
  value: number
}

type ReplaysChartProps = {
  data: readonly ReplayDay[]
}

// deriva um yMax "bonito" (múltiplo de 10) com 15% de folga acima do maior valor
function computeYMax(data: readonly ReplayDay[]) {
  const max = data.length ? Math.max(...data.map((d) => d.value)) : 0
  const withPadding = Math.max(max * 1.15, 10)
  return Math.ceil(withPadding / 10) * 10
}

// gráfico de barras css — mock dos replays dos últimos 7 dias, sem lib extra
export function ReplaysChart({ data }: ReplaysChartProps) {
  const yMax = useMemo(() => computeYMax(data), [data])
  const yTicks = useMemo(
    () => [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax],
    [yMax],
  )
  const { shouldReduce } = useMotionSafe()

  return (
    <section className="bg-card border-border rounded-xl border p-5 md:p-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-tg-brand-blue flex items-center gap-2 text-lg font-bold">
            <ChartColumn className="size-5" />
            Replays gerados por dia
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Quantidade de replays gerados no sistema nos últimos 7 dias.
          </p>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span className="bg-tg-brand-blue size-3 rounded-[2px]" />
          Replays
        </div>
      </header>

      <div className="flex gap-3 pt-3">
        <div className="relative h-64 w-6 shrink-0">
          {yTicks.map((tick) => (
            <span
              key={tick}
              className="text-muted-foreground absolute right-0 text-xs leading-none"
              style={{
                bottom: `${(tick / yMax) * 100}%`,
                transform:
                  tick === 0
                    ? 'none'
                    : tick === yMax
                      ? 'translateY(100%)'
                      : 'translateY(50%)',
              }}
            >
              {Math.round(tick)}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative h-64">
            <div className="pointer-events-none absolute inset-0 flex flex-col-reverse justify-between">
              {yTicks.map((tick) => (
                <div key={tick} className="border-border/70 border-t" />
              ))}
            </div>

            <div className="relative flex h-full items-end justify-around gap-2 px-1 sm:px-4">
              {data.map((day, index) => {
                const barPct = `${(day.value / yMax) * 100}%`
                return (
                  <div
                    key={day.date}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  >
                    <motion.div
                      initial={shouldReduce ? { height: barPct } : { height: 0 }}
                      animate={{ height: barPct }}
                      transition={{
                        duration: motionTokens.durations.slow,
                        delay: shouldReduce ? 0 : index * 0.06,
                        ease: motionTokens.ease.out,
                      }}
                      whileHover={
                        shouldReduce ? undefined : { scale: 1.04, y: -2 }
                      }
                      className="bg-tg-brand-blue relative w-full max-w-14 origin-bottom rounded-t-sm"
                    >
                      <span className="text-tg-brand-blue absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold tabular-nums">
                        {day.value}
                      </span>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-2 flex justify-around gap-2 px-1 sm:px-4">
            {data.map((day) => (
              <span
                key={day.date}
                className="text-muted-foreground min-w-0 flex-1 text-center text-xs"
              >
                {day.date}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
