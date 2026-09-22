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
    <article className="bg-card border-border flex min-h-32 flex-col gap-3 rounded-xl border p-4">
      <div className="text-tg-brand-blue flex items-center gap-2">
        <Icon className="size-4" />
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      <p className="text-tg-brand-blue-dark text-center text-3xl font-bold">
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
