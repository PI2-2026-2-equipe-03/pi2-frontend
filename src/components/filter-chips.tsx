import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type FilterChipsProps<T extends string> = {
  options: ReadonlyArray<{ value: T; label: string }>
  value: T
  onChange: (next: T) => void
  className?: string
  ariaLabel?: string
}

// pills horizontais com estado ativo em cor da marca. mobile scrolla
// horizontalmente se os chips não couberem na linha. uso adequado:
// listas curtas (2-4 opções). para listas longas, use Select.
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
  ariaLabel,
}: FilterChipsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <motion.button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            whileTap={{ scale: 0.95 }}
            animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              'focus-visible:ring-tg-brand-blue/40 focus-visible:ring-2 focus-visible:outline-none',
              isActive
                ? 'bg-tg-brand-blue text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
            )}
          >
            {option.label}
          </motion.button>
        )
      })}
    </div>
  )
}
