import { useEffect, useId, useMemo, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { useHaptics } from '@/lib/haptics'
import { cn } from '@/lib/utils'

type HourChipsProps = {
  /** one-hour slots that have a recording, as "HH:00" */
  availableHours: readonly string[]
  value: string | null
  onChange: (next: string | null) => void
  className?: string
}

function hourKey(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

// the row spans one hour past each end of the data instead of a fixed business
// day: an empty 06:00 nobody ever books is noise, while the hour right before
// and after real play reads as "nobody played then"
function hourRange(availableHours: readonly string[]): string[] {
  const hours = availableHours
    .map((key) => Number(key.slice(0, 2)))
    .filter((hour) => Number.isInteger(hour))
  if (hours.length === 0) return []
  const first = Math.max(0, Math.min(...hours) - 1)
  const last = Math.min(23, Math.max(...hours) + 1)
  const slots: string[] = []
  for (let hour = first; hour <= last; hour += 1) {
    slots.push(hourKey(hour))
  }
  return slots
}

// the prototype's hours live here, in plain sight, instead of behind the
// "Filtros" sheet: on mobile the row scrolls, the page never does
export function HourChips({
  availableHours,
  value,
  onChange,
  className,
}: HourChipsProps) {
  const labelId = useId()
  const rowRef = useRef<HTMLUListElement>(null)
  const haptics = useHaptics()

  const available = useMemo(() => new Set(availableHours), [availableHours])
  const slots = useMemo(() => hourRange(availableHours), [availableHours])

  // a deep link (?hour=21:00) can land with the chip off to the right, which
  // reads as "nothing filtered"; only the row scrolls, never the page
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const chip = row.querySelector<HTMLElement>('[data-selected="true"]')
    if (!chip) return
    row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2
  }, [])

  if (slots.length === 0) return null

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      data-slot="hour-chips"
      className={cn('flex min-w-0 flex-col gap-2', className)}
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span id={labelId} className="text-foreground text-sm font-medium">
          Horário
        </span>
        <span className="text-muted-foreground text-xs">
          Apagados são horários sem gravação.
        </span>
      </div>

      <ul
        ref={rowRef}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-x-visible md:pb-0"
      >
        {slots.map((slot) => {
          const hasReplay = available.has(slot)
          const isSelected = value === slot
          return (
            <li key={slot}>
              <Button
                type="button"
                size="sm"
                variant={isSelected ? 'brand' : 'brandOutline'}
                aria-pressed={isSelected}
                aria-label={hasReplay ? slot : `${slot}, sem gravação`}
                disabled={!hasReplay}
                data-hour={slot}
                data-available={hasReplay}
                data-selected={isSelected}
                onClick={() => {
                  haptics()
                  onChange(isSelected ? null : slot)
                }}
                className="min-h-touch-min rounded-full px-4 tabular-nums"
              >
                {slot}
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
