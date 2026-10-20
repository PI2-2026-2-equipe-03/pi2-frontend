import { motion } from 'framer-motion'
import { CalendarDays, VideoOff, X } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'

import { CityCombobox } from '@/components/city-combobox'
import { EmptyState } from '@/components/empty-state'
import { ListingToolbar } from '@/components/listing-toolbar'
import { PaginationControl } from '@/components/pagination-control'
import { QueryErrorState } from '@/components/query-error-state'
import { SearchCombobox } from '@/components/search-combobox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  citiesFromArenas,
  indexById,
  useArenas,
  useQuadras,
  useReplays,
} from '@/lib/api/queries'
import { motionTokens } from '@/lib/motion'
import { usePagination } from '@/lib/pagination'
import { createCourtSuggestions } from '@/lib/search'

import { ReplayCard } from './components/replay-card'
import { ReplayCardSkeleton } from './components/replay-card-skeleton'

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.03 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.durations.base,
      ease: motionTokens.ease.out,
    },
  },
}

const CITY_ANY = 'all'
const HOUR_ANY = 'all'

// recordedAt é iso em utc; data e hora do filtro valem no fuso do usuário
// (gravação às 22h em brasília não pode cair no dia seguinte)
function localDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function localHourKey(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:00`
}

export function Replays() {
  const [city, setCity] = useQueryState('city', { defaultValue: CITY_ANY })
  const [date, setDate] = useQueryState('date', { defaultValue: '' })
  const [hour, setHour] = useQueryState('hour', { defaultValue: HOUR_ANY })
  const [courtId, setCourtId] = useQueryState('court', { defaultValue: '' })
  const [courtQ, setCourtQ] = useQueryState('q', { defaultValue: '' })

  const replaysQuery = useReplays()
  const arenasQuery = useArenas()
  const quadrasQuery = useQuadras()

  const replays = useMemo(() => replaysQuery.data ?? [], [replaysQuery.data])
  const arenas = useMemo(() => arenasQuery.data ?? [], [arenasQuery.data])
  const quadras = useMemo(() => quadrasQuery.data ?? [], [quadrasQuery.data])

  const isLoading = replaysQuery.isPending
  const isError = replaysQuery.isError

  const dataset = useMemo(() => ({ arenas, quadras }), [arenas, quadras])
  const fetchSuggestions = useMemo(
    () => createCourtSuggestions(dataset),
    [dataset],
  )

  const cityOptions = useMemo(() => citiesFromArenas(arenas), [arenas])

  // só oferece os horários que têm gravação, em faixas de 1h ("16:00" = 16:00–16:59)
  const hourOptions = useMemo(() => {
    const set = new Set(
      replays.map((replay) => localHourKey(new Date(replay.recordedAt))),
    )
    return Array.from(set).sort()
  }, [replays])

  const selectedCourtName = useMemo(() => {
    if (!courtId) return ''
    const quadra = quadras.find((q) => q.id === courtId)
    if (!quadra) return ''
    const arena = indexById(arenas).get(quadra.arenaId)
    return arena ? `${quadra.nome} — ${arena.nome}` : quadra.nome
  }, [arenas, courtId, quadras])

  const replaysFiltrados = useMemo(() => {
    return replays.filter((replay) => {
      const recordedAt = new Date(replay.recordedAt)
      const passaCity = city === CITY_ANY || replay.city === city
      const passaCourt = !courtId || replay.court.id === courtId
      const passaDate = !date || localDateKey(recordedAt) === date
      const passaHour = hour === HOUR_ANY || localHourKey(recordedAt) === hour
      return passaCity && passaCourt && passaDate && passaHour
    })
  }, [city, courtId, date, hour, replays])

  const pagination = usePagination({
    items: replaysFiltrados,
    pageParam: 'page',
  })

  const hasActiveFilters = Boolean(
    (city && city !== CITY_ANY) || date || hour !== HOUR_ANY || courtId,
  )

  function resetPage() {
    pagination.setPage(1)
  }

  function clearFilters() {
    setCity(null)
    setDate(null)
    setHour(null)
    setCourtId(null)
    setCourtQ(null)
    resetPage()
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-tg-brand-blue text-[clamp(1.5rem,3vw,2rem)] font-bold">
            Replays
          </h1>
          <p className="text-tg-brand-blue font-medium">
            Replays disponíveis nos últimos 7 dias. Assista ou baixe antes de
            expirar.
          </p>
        </div>
        {hasActiveFilters ? (
          <Button variant="brandOutline" size="sm" onClick={clearFilters}>
            <X className="size-4" />
            Limpar filtros
          </Button>
        ) : null}
      </header>

      <ListingToolbar
        activeCount={
          (city !== CITY_ANY ? 1 : 0) +
          (date ? 1 : 0) +
          (hour !== HOUR_ANY ? 1 : 0) +
          (courtId ? 1 : 0)
        }
        onClearAll={clearFilters}
        search={
          <SearchCombobox
            value={courtQ || selectedCourtName}
            onValueChange={(value) => {
              setCourtQ(value || null)
              if (!value) {
                setCourtId(null)
                resetPage()
              }
            }}
            onSelect={(suggestion) => {
              if (suggestion.payload.kind === 'court') {
                setCourtId(suggestion.payload.value)
                setCourtQ(suggestion.label)
                resetPage()
              }
            }}
            fetchSuggestions={fetchSuggestions}
            placeholder="Buscar por quadra, arena ou cidade…"
            emptyMessage="Nenhuma correspondência."
          />
        }
        filters={[
          {
            id: 'city',
            label: 'Cidade',
            active: city !== CITY_ANY,
            control: (
              <CityCombobox
                value={city}
                onValueChange={(v) => {
                  setCity(v === CITY_ANY ? null : v)
                  resetPage()
                }}
                cities={cityOptions}
                anyValue={CITY_ANY}
              />
            ),
          },
          {
            id: 'date',
            label: 'Data',
            active: Boolean(date),
            position: 'trailing',
            width: '11rem',
            control: (
              <div className="border-border bg-background focus-within:border-tg-brand-blue/60 focus-within:ring-tg-brand-blue/20 flex items-center gap-2 rounded-md border px-3 py-1.5 transition-colors focus-within:ring-2">
                <CalendarDays className="text-muted-foreground size-4 shrink-0" />
                <Input
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value || null)
                    resetPage()
                  }}
                  className="h-7 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
              </div>
            ),
          },
          {
            id: 'hour',
            label: 'Horário',
            active: hour !== HOUR_ANY,
            position: 'trailing',
            width: '10rem',
            control: (
              <CityCombobox
                value={hour}
                onValueChange={(v) => {
                  setHour(v === HOUR_ANY ? null : v)
                  resetPage()
                }}
                cities={hourOptions}
                anyValue={HOUR_ANY}
                anyLabel="Todos os horários"
                placeholder="Horário"
                searchPlaceholder="Buscar horário…"
                emptyMessage="Nenhum horário com replay."
              />
            ),
          },
        ]}
      />

      {isLoading ? (
        <ul
          aria-busy="true"
          aria-live="polite"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <ReplayCardSkeleton />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <QueryErrorState
          title="Não foi possível carregar os replays"
          error={replaysQuery.error}
          onRetry={() => void replaysQuery.refetch()}
          isRetrying={replaysQuery.isRefetching}
        />
      ) : replaysFiltrados.length === 0 ? (
        <EmptyState
          icon={VideoOff}
          title="Nenhum replay encontrado"
          description={
            hasActiveFilters
              ? 'Ajuste os filtros ou limpe para ver todos os replays.'
              : 'Nenhum replay disponível no momento.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="brandOutline" onClick={clearFilters}>
                Limpar filtros
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <motion.ul
            key={pagination.page}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {pagination.pageItems.map((replay) => (
              <motion.li key={replay.id} variants={itemVariants}>
                <ReplayCard replay={replay} />
              </motion.li>
            ))}
          </motion.ul>
          <PaginationControl
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
          />
        </>
      )}
    </div>
  )
}
