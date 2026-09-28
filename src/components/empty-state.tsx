import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { transitions } from '@/lib/motion'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transitions.fadeIn}
      className="border-border bg-card/40 mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed p-10 text-center"
    >
      <div className="bg-tg-brand-yellow/15 ring-tg-brand-yellow/25 flex size-16 items-center justify-center rounded-full ring-8">
        <Icon className="text-tg-brand-blue size-7" />
      </div>
      <div className="space-y-1">
        <h2 className="text-foreground text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </motion.div>
  )
}
