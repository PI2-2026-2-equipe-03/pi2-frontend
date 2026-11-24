// rn-01 keeps a replay for 7 days, so the date filter has a hard floor: an
// older day has nothing to return, and the ui says so instead of going empty
export const RETENTION_DAYS = 7

export type RetentionWindow = {
  start: Date
  end: Date
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

// anchored on day 1: adding a month to the 31st would overflow into the next
export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

// recordedAt is iso utc, while the day the user filters by is their own
// (a 22:00 recording in brasília must not land on the next day)
export function localDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// new Date('2026-11-22') is utc midnight, which is still the 21st in brazil.
// the roundtrip is the actual validation: the regex only checks the shape, and
// the constructor rolls an impossible value forward instead of going invalid
// (2026-13-45 -> 2027-02-14) and maps a two-digit year onto 1900 (0050 -> 1950)
export function parseDateKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key)
  if (!match) return null
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  )
  return localDateKey(date) === key ? date : null
}

// inclusive on both ends: today plus the days before it
export function retentionWindow(
  now: Date,
  days: number = RETENTION_DAYS,
): RetentionWindow {
  const end = startOfDay(now)
  return { start: addDays(end, -(days - 1)), end }
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isWithinWindow(
  date: Date,
  retention: RetentionWindow,
): boolean {
  const day = startOfDay(date).getTime()
  return day >= retention.start.getTime() && day <= retention.end.getTime()
}

const WEEK_LENGTH = 7
const GRID_WEEKS = 6

// always 6 sunday-first weeks: a fixed height keeps the sheet from resizing
// when the user pages between months
export function monthGrid(month: Date): Date[] {
  const first = startOfMonth(month)
  const start = addDays(first, -first.getDay())
  return Array.from({ length: GRID_WEEKS * WEEK_LENGTH }, (_, index) =>
    addDays(start, index),
  )
}
