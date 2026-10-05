import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MapPinOff, RefreshCw, WifiOff } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'

import { EmptyState } from '@/components/empty-state'
import { ListingToolbar } from '@/components/listing-toolbar'
import { PaginationControl } from '@/components/pagination-control'
import { SearchCombobox } from '@/components/search-combobox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { listArenas } from '@/lib/api/arenas'
import { motionTokens } from '@/lib/motion'
import { usePagination } from '@/lib/pagination'
import { arenaSuggestions } from '@/lib/search'

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

  const arenasQuery = useQuery({
    queryKey: ['arenas'],
    queryFn: listArenas,
  })

  const arenas = useMemo(
    () => arenasQuery.data?.data ?? [],
    [arenasQuery.data],
  )

  const isLoading = arenasQuery.isPending
  const isError = arenasQuery.isError

  const cidadesDisponiveis = useMemo(() => {
    const set = new Set(arenas.map((a) => a.cidade))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [arenas])

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
            fetchSuggestions={arenaSuggestions}
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
              <Select
                value={cidade}
                onValueChange={(v) => {
                  setCidade(v || null)
                  resetPage()
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CITY_ANY}>Todas as cidades</SelectItem>
                  {cidadesDisponiveis.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            >
              <RefreshCw className="size-4" />
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
                <ArenaCard arena={arena} />
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
