import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CalendarDays, RefreshCw, VideoOff, WifiOff, X } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'

import { EmptyState } from '@/components/empty-state'
import { ListingToolbar } from '@/components/listing-toolbar'
import { PaginationControl } from '@/components/pagination-control'
import { SearchCombobox } from '@/components/search-combobox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toReplayView } from '@/lib/api/mappers'
import { listReplays } from '@/lib/api/replays'
import { ARENAS, QUADRAS } from '@/lib/mocks'
import { motionTokens } from '@/lib/motion'
import { usePagination } from '@/lib/pagination'
import { courtSuggestions } from '@/lib/search'

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

export function Replays() {
  const [city, setCity] = useQueryState('city', { defaultValue: CITY_ANY })
  const [date, setDate] = useQueryState('date', { defaultValue: '' })
  const [courtId, setCourtId] = useQueryState('court', { defaultValue: '' })
  const [courtQ, setCourtQ] = useQueryState('q', { defaultValue: '' })

  const replaysQuery = useQuery({
    queryKey: ['replays'],
    queryFn: listReplays,
  })

  const replays = useMemo(
    () => (replaysQuery.data?.data ?? []).map(toReplayView),
    [replaysQuery.data],
  )

  const isLoading = replaysQuery.isPending
  const isError = replaysQuery.isError

  const cityOptions = useMemo(() => {
    const fromApi = replays.map((replay) => replay.city).filter(Boolean)
    const set = new Set(
      fromApi.length > 0 ? fromApi : ARENAS.map((a) => a.cidade),
    )
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [replays])

  const selectedCourtName = useMemo(() => {
    if (!courtId) return ''
    const quadra = QUADRAS.find((q) => q.id === Number(courtId))
    if (!quadra) return ''
    const arena = ARENAS.find((a) => a.id === quadra.arenaId)
    return arena ? `${quadra.nome} — ${arena.nome}` : quadra.nome
  }, [courtId])

  const replaysFiltrados = useMemo(() => {
    return replays.filter((replay) => {
      const passaCity = city === CITY_ANY || replay.city === city
      const passaCourt = !courtId || String(replay.court.id) === courtId
      const passaDate = !date || replay.recordedAt.startsWith(date)
      return passaCity && passaCourt && passaDate
    })
  }, [city, courtId, date, replays])

  const pagination = usePagination({
    items: replaysFiltrados,
    pageParam: 'page',
  })

  const hasActiveFilters = Boolean(
    (city && city !== CITY_ANY) || date || courtId,
  )

  function resetPage() {
    pagination.setPage(1)
  }

  function clearFilters() {
    setCity(null)
    setDate(null)
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
                setCourtId(String(suggestion.payload.value))
                setCourtQ(suggestion.label)
                resetPage()
              }
            }}
            fetchSuggestions={courtSuggestions}
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
              <Select
                value={city}
                onValueChange={(v) => {
                  setCity(v || null)
                  resetPage()
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CITY_ANY}>Todas as cidades</SelectItem>
                  {cityOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          },
          {
            id: 'date',
            label: 'Data',
            active: Boolean(date),
            position: 'trailing',
            width: '11rem',
            control: (
              <div className="border-border bg-background flex items-center gap-2 rounded-md border px-3 py-1.5">
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
        <EmptyState
          icon={WifiOff}
          title="Não foi possível carregar os replays"
          description="Confira se a API está no ar e tente novamente."
          action={
            <Button
              variant="brandOutline"
              onClick={() => void replaysQuery.refetch()}
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          }
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
