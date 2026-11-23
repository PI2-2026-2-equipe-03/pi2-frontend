import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { BottomSheet } from '@/components/bottom-sheet'
import { Button } from '@/components/ui/button'
import {
  addMonths,
  isSameDay,
  isWithinWindow,
  localDateKey,
  monthGrid,
  parseDateKey,
  RETENTION_DAYS,
  retentionWindow,
  startOfMonth,
} from '@/lib/dates'
import { useHaptics } from '@/lib/haptics'
import { DESKTOP_QUERY, useMediaQuery } from '@/lib/use-media-query'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})
const shortFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})
const longFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

type CalendarSheetProps = {
  /** selected day as "YYYY-MM-DD", or null for "any date" */
  value: string | null
  onChange: (next: string | null) => void
  className?: string
}

// the os date picker that <input type="date"> opens looks different on every
// phone and, worse, happily offers days rn-01 already deleted. this one shows
// the retention window and greys out everything outside it
export function CalendarSheet({
  value,
  onChange,
  className,
}: CalendarSheetProps) {
  const [open, setOpen] = useState(false)
  const haptics = useHaptics()
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  // frozen while the sheet is open, so the grid never shifts under the finger
  // at midnight; refreshed on every open
  const [now, setNow] = useState(() => new Date())
  const selected = useMemo(() => (value ? parseDateKey(value) : null), [value])
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(now))

  const retention = useMemo(() => retentionWindow(now), [now])
  const days = useMemo(() => monthGrid(visibleMonth), [visibleMonth])

  // the trigger is on screen without the sheet ever opening, so "hoje" can't
  // come from `now`: a tab left overnight would keep calling yesterday today
  const todayKey = localDateKey(new Date())

  // the window spans two months at most, so paging stops at its edges instead
  // of letting the user wander into months with nothing selectable
  const firstMonth = startOfMonth(retention.start)
  const lastMonth = startOfMonth(retention.end)
  const canGoBack = visibleMonth.getTime() > firstMonth.getTime()
  const canGoForward = visibleMonth.getTime() < lastMonth.getTime()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) return
    const fresh = new Date()
    setNow(fresh)
    // a shared link can carry a date the window no longer covers; opening on
    // its month would strand the user where every day and both arrows are
    // dead, so the calendar starts where there is still something to pick
    const freshWindow = retentionWindow(fresh)
    const target =
      selected && isWithinWindow(selected, freshWindow) ? selected : fresh
    setVisibleMonth(startOfMonth(target))
  }

  function pick(day: Date) {
    haptics()
    onChange(localDateKey(day))
    setOpen(false)
  }

  // falls back to "qualquer data" when `value` is set but unparseable: the
  // clear button below stays live on `value`, so the filter is never stuck
  const triggerLabel =
    value === todayKey
      ? 'Hoje'
      : selected
        ? capitalize(shortFormatter.format(selected))
        : 'Qualquer data'

  return (
    <BottomSheet
      open={open}
      onOpenChange={handleOpenChange}
      // below md the date filter lives inside the "Filtros" sheet, so this one
      // opens stacked on top of it; on desktop it is the only sheet on screen
      nested={!isDesktop}
      title="Data"
      description={`Replays ficam disponíveis por ${RETENTION_DAYS} dias. Datas anteriores já não têm gravação.`}
      // unlike the filters sheet this one also shows up on desktop, where a
      // full-bleed panel would stretch a 7-column grid across 1280px
      className="sm:mx-auto sm:max-w-md"
      bodyClassName="gap-3"
      trigger={
        <Button
          type="button"
          variant="outline"
          aria-label={`Data: ${triggerLabel}`}
          className={cn(
            'min-h-touch-min w-full justify-start gap-2 font-normal',
            className,
          )}
        >
          <CalendarDays
            className="text-muted-foreground size-4 shrink-0"
            aria-hidden
          />
          <span className={cn('truncate', !value && 'text-muted-foreground')}>
            {triggerLabel}
          </span>
        </Button>
      }
      footer={
        <>
          <Button
            type="button"
            variant="brandOutline"
            className="min-h-touch-min flex-1"
            // `value` and not `selected`: an unparseable date still applies a
            // filter, and the sheet has to be able to clear what it shows
            disabled={!value}
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
          >
            Qualquer data
          </Button>
          <Button
            type="button"
            variant="brand"
            className="min-h-touch-comfortable flex-1"
            onClick={() => setOpen(false)}
          >
            Fechar
          </Button>
        </>
      }
    >
      <div className="flex items-center justify-between gap-2">
        {/* aria-disabled and not disabled: the arrow goes dead on the click
            that reaches the edge of the window, and the browser empties the
            focus of an element disabled under it, dropping the user back to
            the top of the document with the sheet still open */}
        <Button
          type="button"
          variant="ghost"
          aria-label="Mês anterior"
          aria-disabled={!canGoBack}
          onClick={() => {
            if (!canGoBack) return
            setVisibleMonth((month) => addMonths(month, -1))
          }}
          className="min-h-touch-min min-w-touch-min rounded-full p-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Button>
        <p aria-live="polite" className="text-foreground text-sm font-medium">
          {capitalize(monthFormatter.format(visibleMonth))}
        </p>
        <Button
          type="button"
          variant="ghost"
          aria-label="Mês seguinte"
          aria-disabled={!canGoForward}
          onClick={() => {
            if (!canGoForward) return
            setVisibleMonth((month) => addMonths(month, 1))
          }}
          className="min-h-touch-min min-w-touch-min rounded-full p-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          <ChevronRight className="size-5" aria-hidden />
        </Button>
      </div>

      <div
        aria-hidden
        className="text-muted-foreground grid grid-cols-7 gap-0.5 text-center text-xs"
      >
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div
        role="group"
        aria-label="Escolha uma data"
        data-slot="calendar-grid"
        className="grid grid-cols-7 gap-0.5"
      >
        {days.map((day) => {
          const key = localDateKey(day)
          const selectable = isWithinWindow(day, retention)
          const isSelected = Boolean(selected && isSameDay(day, selected))
          const isToday = key === todayKey
          const inMonth = day.getMonth() === visibleMonth.getMonth()
          const label = capitalize(longFormatter.format(day))

          return (
            <button
              key={key}
              type="button"
              disabled={!selectable}
              aria-pressed={isSelected}
              // the ring that marks today is invisible to a screen reader
              aria-current={isToday ? 'date' : undefined}
              aria-label={selectable ? label : `${label}, sem replay`}
              data-date={key}
              data-selectable={selectable}
              data-selected={isSelected}
              data-today={isToday}
              onClick={() => pick(day)}
              // the cell keeps its 44px height and takes its width from the
              // grid, so the row never overflows a 320px screen
              className={cn(
                'min-h-touch-min flex w-full items-center justify-center rounded-lg text-sm tabular-nums transition-colors',
                'focus-visible:ring-tg-brand-blue/40 focus-visible:ring-2 focus-visible:outline-none',
                isSelected
                  ? 'bg-tg-brand-blue font-semibold text-white'
                  : selectable
                    ? cn(
                        'hover:bg-muted cursor-pointer',
                        inMonth ? 'text-foreground' : 'text-muted-foreground',
                      )
                    : 'text-muted-foreground/40',
                isToday && !isSelected && 'ring-tg-brand-blue/50 ring-1',
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </BottomSheet>
  )
}
