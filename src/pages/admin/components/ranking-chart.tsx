import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useMemo } from 'react'

import { motionTokens, useMotionSafe } from '@/lib/motion'

type RankingItem = {
  id: string
  label: string
  value: number
}

type RankingChartProps = {
  icon: LucideIcon
  title: string
  description: string
  emptyMessage: string
  items: readonly RankingItem[]
  formatValue: (value: number) => string
}

const BAR_COLORS = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
] as const

// barra proporcional ao maior valor: a api só devolve o top 5, então um
// percentual sobre a lista sairia maior que a participação real de cada item.
export function RankingChart({
  icon: Icon,
  title,
  description,
  emptyMessage,
  items,
  formatValue,
}: RankingChartProps) {
  const { shouldReduce } = useMotionSafe()
  const max = useMemo(
    () => Math.max(...items.map((item) => item.value), 1),
    [items],
  )

  return (
    <section className="bg-card border-border rounded-xl border p-5 md:p-6">
      <header className="mb-4">
        <h2 className="text-tg-brand-blue flex items-center gap-2 text-lg font-bold">
          <Icon className="size-5" />
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </header>

      {items.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-sm">
          {emptyMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => {
            const pct = (item.value / max) * 100
            return (
              <li key={item.id}>
                <div className="mb-1 flex justify-between gap-3 text-sm">
                  <span className="text-foreground min-w-0 truncate font-medium">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground shrink-0 tabular-nums">
                    {formatValue(item.value)}
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
      )}
    </section>
  )
}
