import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  LayoutGrid,
  MapPin,
  RefreshCw,
  WifiOff,
  X,
} from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/empty-state'
import { FilterChips } from '@/components/filter-chips'
import { ListingToolbar } from '@/components/listing-toolbar'
import { PaginationControl } from '@/components/pagination-control'
import { ReplayExpiry } from '@/components/replay-expiry'
import { SearchCombobox } from '@/components/search-combobox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ArenaDto } from '@/lib/api/arenas'
import { listArenas } from '@/lib/api/arenas'
import type { QuadraDto } from '@/lib/api/quadras'
import { listQuadras } from '@/lib/api/quadras'
import { getSponsorForCourt,REPLAY_VIEWS } from '@/lib/mocks'
import { motionTokens } from '@/lib/motion'
import { usePagination } from '@/lib/pagination'
import { arenaSuggestions } from '@/lib/search'
import { cn } from '@/lib/utils'

import { QuadraCardSkeleton } from './components/quadra-card-skeleton'

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

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

const CITY_ANY = 'all'
const STATUS_ANY = 'all'
type StatusFilter = typeof STATUS_ANY | 'disponivel' | 'indisponivel'
const STATUS_OPTIONS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'disponivel', label: 'Disponíveis' },
  { value: 'indisponivel', label: 'Indisponíveis' },
]

function QuadraCard({
  quadra,
  arena,
}: {
  quadra: QuadraDto
  arena: ArenaDto | undefined
}) {
  const sponsor = getSponsorForCourt(quadra.id)
  const replaysDaQuadra = REPLAY_VIEWS.filter(
    (r) => r.court.id === quadra.id,
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          role="button"
          tabIndex={0}
          className="group border-border/60 shadow-card hover:border-tg-brand-blue/40 hover:shadow-card-hover focus-visible:ring-ring/40 cursor-pointer overflow-hidden rounded-2xl py-0 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:outline-none"
        >
          <div className="relative h-28 overflow-hidden">
            <img
              src={arena?.fotoUrl ?? ''}
              alt={`Foto da ${quadra.nome}`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <Badge
              variant={quadra.disponivel ? 'success' : 'destructive'}
              className="absolute top-2 right-2 backdrop-blur"
            >
              {quadra.disponivel ? 'Disponível' : 'Indisponível'}
            </Badge>
          </div>
          <div className="space-y-1.5 p-4">
            <p className="text-foreground group-hover:text-tg-brand-blue font-semibold tracking-tight transition-colors">
              {quadra.nome}
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {arena?.nome ?? 'Arena desconhecida'}
            </p>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="flex max-h-[85svh] flex-col gap-0 overflow-hidden rounded-xl border-0 p-0 shadow-2xl sm:max-w-xl"
      >
        {/* hero reveal — imagem como capa, título sobreposto, close button flutuante */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-56">
          <img
            src={arena?.fotoUrl ?? ''}
            alt={`Foto da ${quadra.nome}`}
            loading="lazy"
            className="size-full object-cover"
          />
          {/* gradient overlay para contraste do texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />

          {/* status pill no canto superior esquerdo */}
          <span
            className={cn(
              'absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur',
              quadra.disponivel
                ? 'bg-emerald-500/90 text-white'
                : 'bg-red-500/90 text-white',
            )}
          >
            {quadra.disponivel ? 'Disponível' : 'Indisponível'}
          </span>

          <DialogClose
            aria-label="Fechar"
            className="focus-visible:ring-white/80 absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-5" />
          </DialogClose>

          {/* título sobreposto na parte inferior da imagem */}
          <div className="absolute right-5 bottom-4 left-5 space-y-0.5 text-white">
            <p className="text-xs font-medium tracking-wide text-white/80 uppercase">
              {arena?.nome ?? 'Arena desconhecida'}
            </p>
            <DialogTitle className="text-2xl leading-tight font-bold tracking-tight drop-shadow-sm md:text-3xl">
              {quadra.nome}
            </DialogTitle>
            {arena ? (
              <DialogDescription className="flex items-center gap-1 text-sm text-white/85">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {arena.cidade}
              </DialogDescription>
            ) : null}
          </div>
        </div>

        {/* zona 3 — conteúdo denso, com overflow-y-auto apenas aqui */}
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-5 sm:p-6">
          {sponsor ? (
            <div className="bg-tg-brand-yellow/15 border-tg-brand-yellow/40 flex items-center gap-3 rounded-xl border p-3">
              <img
                src={sponsor.fotoUrl}
                alt=""
                className="size-10 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Patrocínio oficial
                </p>
                <p className="text-foreground truncate font-semibold">
                  {sponsor.nome}
                </p>
              </div>
            </div>
          ) : null}

          <div>
            <p className="text-foreground mb-2 text-sm font-semibold">
              Últimos replays
            </p>
            {replaysDaQuadra.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Ainda não há replays gravados nesta quadra.
              </p>
            ) : (
              <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                {replaysDaQuadra.slice(0, 3).map((replay) => (
                  <li
                    key={replay.id}
                    className="w-40 shrink-0 sm:w-44"
                  >
                    <div className="relative h-24 w-full overflow-hidden rounded-md sm:h-[6.25rem]">
                      <img
                        src={replay.arena.fotoUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                      <span className="bg-background/90 text-foreground absolute right-1.5 bottom-1.5 rounded-md px-1.5 py-0.5 text-[10px] tabular-nums backdrop-blur">
                        {replay.duration}s
                      </span>
                      <div className="absolute top-1.5 left-1.5">
                        <ReplayExpiry
                          expiresAt={replay.expiresAt}
                          withIcon={false}
                        />
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-1.5 text-xs">
                      {dateFormatter.format(new Date(replay.recordedAt))}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            asChild
            variant="brand"
            className="w-full sm:w-auto sm:self-start"
          >
            <Link to={`/app/replays?court=${quadra.id}`}>
              Ver todos os replays desta quadra
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function isStatusFilter(value: string): value is StatusFilter {
  return value === 'all' || value === 'disponivel' || value === 'indisponivel'
}

export function Quadras() {
  const [arenaId, setArenaId] = useQueryState('arena', { defaultValue: '' })
  const [cidade, setCidade] = useQueryState('city', { defaultValue: CITY_ANY })
  const [status, setStatus] = useQueryState<StatusFilter>('status', {
    defaultValue: STATUS_ANY,
    parse: (value) => (isStatusFilter(value) ? value : STATUS_ANY),
  })
  const [arenaQ, setArenaQ] = useQueryState('q', { defaultValue: '' })
  const [from, setFrom] = useQueryState('from', { defaultValue: '' })

  const arenasQuery = useQuery({
    queryKey: ['arenas'],
    queryFn: listArenas,
  })
  const quadrasQuery = useQuery({
    queryKey: ['quadras'],
    queryFn: listQuadras,
  })

  const arenas = useMemo(
    () => arenasQuery.data?.data ?? [],
    [arenasQuery.data],
  )
  const quadras = useMemo(
    () => quadrasQuery.data?.data ?? [],
    [quadrasQuery.data],
  )

  const arenaById = useMemo(() => {
    const map = new Map<number, ArenaDto>()
    for (const arena of arenas) map.set(arena.id, arena)
    return map
  }, [arenas])

  const isLoading = arenasQuery.isPending || quadrasQuery.isPending
  const isError = arenasQuery.isError || quadrasQuery.isError

  const arenaSelecionada = useMemo(
    () =>
      arenaId ? arenas.find((a) => a.id === Number(arenaId)) : undefined,
    [arenaId, arenas],
  )

  const cityOptions = useMemo(() => {
    const set = new Set(arenas.map((a) => a.cidade))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [arenas])

  const quadrasFiltradas = useMemo(() => {
    return quadras.filter((quadra) => {
      const arena = arenaById.get(quadra.arenaId)
      if (!arena) return false
      const passaArena = !arenaId || quadra.arenaId === Number(arenaId)
      const passaCidade = cidade === CITY_ANY || arena.cidade === cidade
      const passaStatus =
        status === STATUS_ANY ||
        (status === 'disponivel' && quadra.disponivel) ||
        (status === 'indisponivel' && !quadra.disponivel)
      return passaArena && passaCidade && passaStatus
    })
  }, [arenaById, arenaId, cidade, quadras, status])

  const pagination = usePagination({
    items: quadrasFiltradas,
    pageParam: 'page',
  })

  function refetchAll() {
    void arenasQuery.refetch()
    void quadrasQuery.refetch()
  }

  function resetPage() {
    pagination.setPage(1)
  }

  const hasActiveFilters =
    Boolean(arenaId) ||
    cidade !== CITY_ANY ||
    status !== STATUS_ANY ||
    Boolean(arenaQ)

  // breadcrumb aparece apenas enquanto a navegação for 100% deep-link via card de arena.
  // qualquer interação com os filtros marca o estado como "manual" e esconde o breadcrumb.
  const isDeepLinked = Boolean(arenaId) && from === 'arena'

  function markManual() {
    if (from) setFrom(null)
  }

  function clearFilters() {
    setArenaId(null)
    setCidade(null)
    setStatus(null)
    setArenaQ(null)
    setFrom(null)
    resetPage()
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        {isDeepLinked && arenaSelecionada ? (
          <nav
            aria-label="breadcrumb"
            className="text-muted-foreground flex items-center gap-1 text-xs"
          >
            <Link to="/app" className="hover:text-foreground">
              Início
            </Link>
            <ChevronRight className="size-3" />
            <Link to="/app/arenas" className="hover:text-foreground">
              Arenas
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">
              {arenaSelecionada.nome}
            </span>
          </nav>
        ) : null}

        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-tg-brand-blue text-[clamp(1.5rem,3vw,2rem)] font-bold">
              {isDeepLinked && arenaSelecionada
                ? `Quadras de ${arenaSelecionada.nome}`
                : 'Quadras'}
            </h1>
            {isDeepLinked && arenaSelecionada ? (
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin className="size-3" />
                {arenaSelecionada.cidade}
              </p>
            ) : (
              <p className="text-tg-brand-blue font-medium">
                Escolha uma quadra para ver seus replays.
              </p>
            )}
          </div>
          {hasActiveFilters ? (
            <Button variant="brandOutline" size="sm" onClick={clearFilters}>
              <X className="size-4" />
              Limpar filtros
            </Button>
          ) : null}
        </div>
      </header>

      <ListingToolbar
        activeCount={
          (arenaId ? 1 : 0) +
          (cidade !== CITY_ANY ? 1 : 0) +
          (status !== STATUS_ANY ? 1 : 0)
        }
        onClearAll={clearFilters}
        search={
          <SearchCombobox
            value={arenaQ || arenaSelecionada?.nome || ''}
            onValueChange={(value) => {
              setArenaQ(value || null)
              if (!value) {
                setArenaId(null)
                resetPage()
              }
              markManual()
            }}
            onSelect={(suggestion) => {
              if (suggestion.payload.kind === 'arena') {
                setArenaId(String(suggestion.payload.value))
                setArenaQ(suggestion.label)
                markManual()
                resetPage()
              }
            }}
            fetchSuggestions={arenaSuggestions}
            placeholder="Filtrar por arena ou cidade…"
            emptyMessage="Nenhuma arena."
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
                  markManual()
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
            id: 'status',
            label: 'Status',
            active: status !== STATUS_ANY,
            position: 'trailing',
            control: (
              <FilterChips
                ariaLabel="Status da quadra"
                options={STATUS_OPTIONS}
                value={status}
                onChange={(next) => {
                  setStatus(next === STATUS_ANY ? null : next)
                  markManual()
                  resetPage()
                }}
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
              <QuadraCardSkeleton />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <EmptyState
          icon={WifiOff}
          title="Não foi possível carregar as quadras"
          description="Confira se a API está no ar e tente novamente."
          action={
            <Button variant="brandOutline" onClick={refetchAll}>
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          }
        />
      ) : quadrasFiltradas.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Nenhuma quadra encontrada"
          description={
            hasActiveFilters
              ? 'Ajuste os filtros ou limpe para ver todas as quadras.'
              : 'Nenhuma quadra cadastrada.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="brandOutline" onClick={clearFilters}>
                Limpar filtros
              </Button>
            ) : (
              <Button asChild variant="brandOutline">
                <Link to="/app/arenas">Voltar às arenas</Link>
              </Button>
            )
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
            {pagination.pageItems.map((quadra) => (
              <motion.li key={quadra.id} variants={itemVariants}>
                <QuadraCard
                  quadra={quadra}
                  arena={arenaById.get(quadra.arenaId)}
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
