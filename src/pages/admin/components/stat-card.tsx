import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type StatCardProps = {
  icon: LucideIcon
  title: string
  value: number | string
  hint?: string
  hintVariant?: 'success' | 'muted'
}

// card de kpi do painel: ícone + título + valor + rodapé opcional
export function StatCard({
  icon: Icon,
  title,
  value,
  hint,
  hintVariant = 'muted',
}: StatCardProps) {
  // denser on phones so the ranking below stays above the fold
  return (
    <article className="bg-card border-border group flex min-h-24 flex-col justify-between gap-2 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-md sm:min-h-32 sm:gap-4 sm:p-4">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <h2 className="text-muted-foreground text-xs font-medium sm:text-sm">
          {title}
        </h2>
        <span className="bg-tg-brand-blue/10 text-tg-brand-blue inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-transform group-hover:rotate-6 sm:size-10">
          <Icon className="size-4 sm:size-5" />
        </span>
      </div>
      <p className="text-tg-brand-blue-dark text-2xl font-bold tabular-nums sm:text-4xl">
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
