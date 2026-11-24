import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { CalendarSheet } from '@/components/calendar-sheet'
import { CityCombobox } from '@/components/city-combobox'
import { EmptyState } from '@/components/empty-state'
import { ListingToolbar } from '@/components/listing-toolbar'
import { LoadMore } from '@/components/load-more'
import { PullToRefresh } from '@/components/pull-to-refresh'
import { QueryErrorState } from '@/components/query-error-state'
import { SearchCombobox } from '@/components/search-combobox'
import { Button } from '@/components/ui/button'
import {
  citiesFromArenas,
  indexById,
  queryKeys,
  useArenas,
  useQuadras,
  useReplays,
} from '@/lib/api/queries'
import {
  isWithinWindow,
  localDateKey,
  parseDateKey,
  RETENTION_DAYS,
  retentionWindow,
} from '@/lib/dates'
import { useClientInfiniteList } from '@/lib/infinite-list'
import { motionTokens } from '@/lib/motion'
import { createCourtSuggestions } from '@/lib/search'
import { useScrollRestoration } from '@/lib/use-scroll-restoration'

import { HourChips } from './components/hour-chips'
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

// recordedAt é iso em utc; a hora do filtro vale no fuso do usuário
// (gravação às 22h em brasília não pode cair no dia seguinte)
function localHourKey(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:00`
}

export function Replays() {
  const location = useLocation()
  const queryClient = useQueryClient()
  const [city, setCity] = useQueryState('city', { defaultValue: CITY_ANY })
  const [date, setDate] = useQueryState('date', { defaultValue: '' })
  const [hour, setHour] = useQueryState('hour', { defaultValue: HOUR_ANY })
  const [courtId, setCourtId] = useQueryState('court', { defaultValue: '' })
  const [courtQ, setCourtQ] = useQueryState('q', { defaultValue: '' })

  // ?date= arrives from a shared link or by hand, and the <input type="date">
  // this screen used to carry accepted anything. garbage is dropped; a real
  // date outside the window is kept and explained, because silently rewriting
  // the url the user just opened is its own kind of surprise
  const parsedDate = useMemo(() => (date ? parseDateKey(date) : null), [date])
  const dateKey = parsedDate ? localDateKey(parsedDate) : null
  const dateOutOfWindow = useMemo(() => {
    if (!parsedDate) return false
    return !isWithinWindow(parsedDate, retentionWindow(new Date()))
  }, [parsedDate])

  useEffect(() => {
    if (date && !parsedDate) setDate(null)
  }, [date, parsedDate, setDate])

  const replaysQuery = useReplays()
  const arenasQuery = useArenas()
  const quadrasQuery = useQuadras()

  const replays = useMemo(() => replaysQuery.data ?? [], [replaysQuery.data])
  const arenas = useMemo(() => arenasQuery.data ?? [], [arenasQuery.data])
  const quadras = useMemo(() => quadrasQuery.data ?? [], [quadrasQuery.data])

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
    return arena ? `${quadra.nome} - ${arena.nome}` : quadra.nome
  }, [arenas, courtId, quadras])

  const replaysFiltrados = useMemo(() => {
    return replays.filter((replay) => {
      const recordedAt = new Date(replay.recordedAt)
      const passaCity = city === CITY_ANY || replay.city === city
      const passaCourt = !courtId || replay.court.id === courtId
      const passaDate = !dateKey || localDateKey(recordedAt) === dateKey
      const passaHour = hour === HOUR_ANY || localHourKey(recordedAt) === hour
      return passaCity && passaCourt && passaDate && passaHour
    })
  }, [city, courtId, dateKey, hour, replays])

  // the key carries everything the slicing depends on, so a filter change or a
  // refresh starts the list over at page 1 — and an unchanged key hands every
  // loaded page back from the cache when the detail screen releases the list
  const infinite = useClientInfiniteList({
    queryKey: [
      ...queryKeys.replays,
      'infinite',
      replaysQuery.dataUpdatedAt,
      { city, dateKey, hour, courtId },
    ],
    items: replaysFiltrados,
    enabled: !replaysQuery.isPending,
  })

  // the slice lands a microtask after the source does: folded in here, the
  // list waits on the skeleton instead of blinking through "fim da lista"
  const isLoading = replaysQuery.isPending || infinite.isPending

  // coming back to item 40 needs the pages up to it already loaded — the
  // infinite cache is what returns them, and only then is the page tall
  // enough for the saved offset to mean anything
  useScrollRestoration(
    location.key,
    !isLoading && !isError && infinite.items.length > 0,
  )

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: queryKeys.replays }),
    [queryClient],
  )

  const hasActiveFilters = Boolean(
    (city && city !== CITY_ANY) || dateKey || hour !== HOUR_ANY || courtId,
  )

  // with no numbered pages left, a filter that shrinks the list would drop
  // the user somewhere in the middle of whatever survived it
  function backToTop() {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function clearFilters() {
    setCity(null)
    setDate(null)
    setHour(null)
    setCourtId(null)
    setCourtQ(null)
    backToTop()
  }

  return (
    <PullToRefresh
      onRefresh={refresh}
      disabled={isLoading || isError}
      className="mx-auto max-w-6xl"
    >
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-tg-brand-text text-[clamp(1.5rem,3vw,2rem)] font-bold">
              Replays
            </h1>
            <p className="text-tg-brand-text font-medium">
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
            (city !== CITY_ANY ? 1 : 0) + (dateKey ? 1 : 0) + (courtId ? 1 : 0)
          }
          onClearAll={clearFilters}
          search={
            <SearchCombobox
              value={courtQ || selectedCourtName}
              onValueChange={(value) => {
                setCourtQ(value || null)
                if (!value) {
                  setCourtId(null)
                  backToTop()
                }
              }}
              onSelect={(suggestion) => {
                if (suggestion.payload.kind === 'court') {
                  setCourtId(suggestion.payload.value)
                  setCourtQ(suggestion.label)
                  backToTop()
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
                    backToTop()
                  }}
                  cities={cityOptions}
                  anyValue={CITY_ANY}
                />
              ),
            },
            {
              id: 'date',
              label: 'Data',
              active: Boolean(dateKey),
              position: 'trailing',
              width: '11rem',
              control: (
                <CalendarSheet
                  value={dateKey}
                  onChange={(next) => {
                    setDate(next)
                    backToTop()
                  }}
                />
              ),
            },
          ]}
        />

        {!isLoading && !isError ? (
          <HourChips
            availableHours={hourOptions}
            value={hour === HOUR_ANY ? null : hour}
            onChange={(next) => {
              setHour(next)
              backToTop()
            }}
          />
        ) : null}

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
            ilustracao={hasActiveFilters ? 'busca-vazia' : 'sem-replays'}
            title="Nenhum replay encontrado"
            description={
              dateOutOfWindow
                ? `Essa data está fora da janela de ${RETENTION_DAYS} dias: os replays dela já expiraram. Escolha uma data mais recente ou limpe o filtro.`
                : hasActiveFilters
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
            {/* sem key na lista: a página nova entra animando item por item em
              vez de reanimar tudo o que já estava na tela */}
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {infinite.items.map((replay) => (
                <motion.li key={replay.id} variants={itemVariants}>
                  <ReplayCard replay={replay} />
                </motion.li>
              ))}
            </motion.ul>
            <LoadMore
              hasNextPage={infinite.hasNextPage}
              isFetchingNextPage={infinite.isFetchingNextPage}
              onLoadMore={infinite.fetchNextPage}
              loadedCount={infinite.items.length}
              totalCount={replaysFiltrados.length}
              itemLabel="replay"
            />
          </>
        )}
      </div>
    </PullToRefresh>
  )
}
