import { motion } from 'framer-motion'
import { MapPinOff, RefreshCw, WifiOff } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'

import { CityCombobox } from '@/components/city-combobox'
import { EmptyState } from '@/components/empty-state'
import { ListingToolbar } from '@/components/listing-toolbar'
import { PaginationControl } from '@/components/pagination-control'
import { SearchCombobox } from '@/components/search-combobox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { citiesFromArenas, useArenas, useQuadras } from '@/lib/api/queries'
import { motionTokens } from '@/lib/motion'
import { usePagination } from '@/lib/pagination'
import { createArenaSuggestions } from '@/lib/search'

import { ArenaCard } from './components/arena-card'
import { ArenaCardSkeleton } from './components/arena-card-skeleton'

const CITY_ANY = 'all'

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
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

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function Arenas() {
  const [q, setQ] = useQueryState('q', { defaultValue: '' })
  const [cidade, setCidade] = useQueryState('cidade', {
    defaultValue: CITY_ANY,
  })

  const arenasQuery = useArenas()
  const quadrasQuery = useQuadras()

  const arenas = useMemo(() => arenasQuery.data ?? [], [arenasQuery.data])
  const quadras = useMemo(() => quadrasQuery.data ?? [], [quadrasQuery.data])

  const isLoading = arenasQuery.isPending
  const isError = arenasQuery.isError

  const cidadesDisponiveis = useMemo(() => citiesFromArenas(arenas), [arenas])

  const fetchSuggestions = useMemo(
    () => createArenaSuggestions(arenas),
    [arenas],
  )

  const quadrasByArena = useMemo(() => {
    const counts = new Map<string, number>()
    for (const quadra of quadras) {
      counts.set(quadra.arenaId, (counts.get(quadra.arenaId) ?? 0) + 1)
    }
    return counts
  }, [quadras])

  const arenasFiltradas = useMemo(() => {
    const termo = normalize(q)
    return arenas.filter((arena) => {
      const passaCidade = cidade === CITY_ANY || arena.cidade === cidade
      const passaBusca =
        !termo ||
        normalize(arena.nome).includes(termo) ||
        normalize(arena.cidade).includes(termo)
      return passaCidade && passaBusca
    })
  }, [arenas, cidade, q])

  const pagination = usePagination({
    items: arenasFiltradas,
    pageParam: 'page',
  })

  function resetPage() {
    pagination.setPage(1)
  }

  function clearFilters() {
    setQ(null)
    setCidade(null)
    resetPage()
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-tg-brand-blue text-[clamp(1.5rem,3vw,2rem)] font-bold">
            Arenas
          </h1>
          <p className="text-tg-brand-blue font-medium">
            Explore locais parceiros e abra as quadras.
          </p>
        </div>
        <Badge variant="outline" className="tabular-nums">
          {arenasFiltradas.length} de {arenas.length}
        </Badge>
      </header>

      <ListingToolbar
        activeCount={(q ? 1 : 0) + (cidade !== CITY_ANY ? 1 : 0)}
        onClearAll={clearFilters}
        search={
          <SearchCombobox
            value={q}
            onValueChange={(value) => {
              setQ(value || null)
              resetPage()
            }}
            fetchSuggestions={fetchSuggestions}
            placeholder="Buscar por arena ou cidade…"
            emptyMessage="Nenhuma arena encontrada."
          />
        }
        filters={[
          {
            id: 'cidade',
            label: 'Cidade',
            active: cidade !== CITY_ANY,
            control: (
              <CityCombobox
                value={cidade}
                onValueChange={(v) => {
                  setCidade(v === CITY_ANY ? null : v)
                  resetPage()
                }}
                cities={cidadesDisponiveis}
                anyValue={CITY_ANY}
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
              <ArenaCardSkeleton />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <EmptyState
          icon={WifiOff}
          title="Não foi possível carregar as arenas"
          description="Confira se a API está no ar e tente novamente."
          action={
            <Button
              variant="brandOutline"
              onClick={() => void arenasQuery.refetch()}
              disabled={arenasQuery.isRefetching}
              aria-busy={arenasQuery.isRefetching}
            >
              <RefreshCw
                className={`size-4 ${arenasQuery.isRefetching ? 'animate-spin' : ''}`}
              />
              Tentar novamente
            </Button>
          }
        />
      ) : arenasFiltradas.length === 0 ? (
        <EmptyState
          icon={MapPinOff}
          title="Nenhuma arena encontrada"
          description="Ajuste os filtros para ver mais locais parceiros."
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
            {pagination.pageItems.map((arena) => (
              <motion.li key={arena.id} variants={itemVariants}>
                <ArenaCard
                  arena={arena}
                  quadrasCount={quadrasByArena.get(arena.id) ?? 0}
                />
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
