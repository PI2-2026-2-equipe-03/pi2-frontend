import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type StatCardProps = {
  icon: LucideIcon
  title: string
  value: number | string
  hint?: string
  hintVariant?: 'success' | 'muted'
}

// card de kpi do painel — ícone + título + valor + rodapé opcional
export function StatCard({
  icon: Icon,
  title,
  value,
  hint,
  hintVariant = 'muted',
}: StatCardProps) {
  return (
    <article className="bg-card border-border group flex min-h-32 flex-col justify-between gap-4 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-muted-foreground text-sm font-medium">{title}</h2>
        <span className="bg-tg-brand-blue/10 text-tg-brand-blue inline-flex size-10 items-center justify-center rounded-full transition-transform group-hover:rotate-6">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="text-tg-brand-blue-dark text-4xl font-bold tabular-nums">
        {value}
      </p>
      {hint ? (
        <p
          className={cn(
            'text-xs',
            hintVariant === 'success'
              ? 'text-success'
              : 'text-muted-foreground',
          )}
        >
          {hint}
        </p>
      ) : (
        <span className="h-4" aria-hidden />
      )}
    </article>
  )
}
