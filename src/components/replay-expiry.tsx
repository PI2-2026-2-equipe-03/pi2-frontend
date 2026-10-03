import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type ReplayExpiryProps = {
  expiresAt: string
  className?: string
  withIcon?: boolean
}

type Severity = 'ok' | 'warning' | 'critical' | 'expired'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

function computeSeverity(remainingMs: number): Severity {
  if (remainingMs <= 0) return 'expired'
  if (remainingMs < 24 * HOUR_MS) return 'critical'
  if (remainingMs < 48 * HOUR_MS) return 'warning'
  return 'ok'
}

function formatRemaining(remainingMs: number): string {
  if (remainingMs <= 0) return 'Expirado'
  const totalHours = Math.floor(remainingMs / HOUR_MS)
  if (totalHours < 1) {
    const minutes = Math.max(1, Math.floor(remainingMs / (60 * 1000)))
    return `${minutes} min`
  }
  const days = Math.floor(remainingMs / DAY_MS)
  const hours = totalHours - days * 24
  if (days === 0) return `${hours}h`
  if (hours === 0) return `${days}d`
  return `${days}d ${hours}h`
}

const TONE: Record<Severity, string> = {
  ok: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900',
  warning:
    'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900',
  critical:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900',
  expired: 'bg-muted text-muted-foreground border-border',
}

export function ReplayExpiry({
  expiresAt,
  className,
  withIcon = true,
}: ReplayExpiryProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const remainingMs = new Date(expiresAt).getTime() - now
  const severity = computeSeverity(remainingMs)
  const label = formatRemaining(remainingMs)
  const prefix = severity === 'expired' ? '' : 'Expira em '

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums',
        TONE[severity],
        className,
      )}
      aria-live="polite"
    >
      {withIcon ? <Clock className="size-3" aria-hidden /> : null}
      {prefix}
      {label}
    </span>
  )
}
