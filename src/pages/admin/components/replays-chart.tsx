import { ChartColumn } from 'lucide-react'

export type ReplayDay = {
  date: string
  value: number
}

type ReplaysChartProps = {
  data: readonly ReplayDay[]
}

const Y_MAX = 40
const Y_TICKS = [0, 10, 20, 30, 40] as const

// gráfico de barras css — mock dos replays dos últimos 7 dias, sem lib extra
export function ReplaysChart({ data }: ReplaysChartProps) {
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

      <div className="flex gap-3">
        <div className="relative h-64 w-6 shrink-0">
          {Y_TICKS.map((tick) => (
            <span
              key={tick}
              className="text-muted-foreground absolute right-0 text-xs leading-none"
              style={{
                bottom: `${(tick / Y_MAX) * 100}%`,
                transform:
                  tick === 0
                    ? 'none'
                    : tick === Y_MAX
                      ? 'translateY(100%)'
                      : 'translateY(50%)',
              }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative h-64">
            <div className="pointer-events-none absolute inset-0 flex flex-col-reverse justify-between">
              {Y_TICKS.map((tick) => (
                <div key={tick} className="border-border/70 border-t" />
              ))}
            </div>

            <div className="relative flex h-full items-end justify-around gap-2 px-1 sm:px-4">
              {data.map((day) => (
                <div
                  key={day.date}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                >
                  <div
                    className="bg-tg-brand-blue relative w-full max-w-14 rounded-t-sm"
                    style={{ height: `${(day.value / Y_MAX) * 100}%` }}
                  >
                    <span className="text-tg-brand-blue absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold">
                      {day.value}
                    </span>
                  </div>
                </div>
              ))}
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
