import { motion } from 'framer-motion'
import { RefreshCw, Video } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/empty-state'
import { FeaturedCard } from '@/components/featured-card'
import { SearchCombobox } from '@/components/search-combobox'
import { Button } from '@/components/ui/button'
import {
  citiesFromArenas,
  useArenas,
  useFeaturedReplay,
  useQuadras,
} from '@/lib/api/queries'
import { motionTokens } from '@/lib/motion'
import type { Suggestion } from '@/lib/search'
import { createArenaSuggestions, suggestArenas } from '@/lib/search'

import { ArenaCard } from './components/arena-card'
import { ArenaCardSkeleton } from './components/arena-card-skeleton'
import { HowItWorks } from './components/how-it-works'

// the home is a shop window, not the catalog: /app/arenas lists everything and
// paginates. two rows on the widest grid.
const ARENA_PREVIEW_LIMIT = 6

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.durations.base,
      ease: motionTokens.ease.out,
    },
  },
}

export function Home() {
  const navigate = useNavigate()
  const [q, setQ] = useQueryState('q', { defaultValue: '' })

  const arenasQuery = useArenas()
  const quadrasQuery = useQuadras()
  const featuredQuery = useFeaturedReplay()

  const arenas = useMemo(() => arenasQuery.data ?? [], [arenasQuery.data])
  const quadras = useMemo(() => quadrasQuery.data ?? [], [quadrasQuery.data])

  const fetchSuggestions = useMemo(
    () => createArenaSuggestions(arenas),
    [arenas],
  )
  const cities = useMemo(() => citiesFromArenas(arenas), [arenas])

  const matches = useMemo(() => suggestArenas(arenas, q), [arenas, q])

  const quadrasByArena = useMemo(() => {
    const counts = new Map<string, number>()
    for (const quadra of quadras) {
      counts.set(quadra.arenaId, (counts.get(quadra.arenaId) ?? 0) + 1)
    }
    return counts
  }, [quadras])

  // replays são escopados à sessão; a Home não quebra se a lista vier vazia.
  const featuredReplay = featuredQuery.data

  function handleSelect(suggestion: Suggestion) {
    if (suggestion.payload.kind === 'arena') {
      navigate(`/app/quadras?arena=${suggestion.payload.value}&from=arena`)
    }
  }

  const hasQuery = Boolean(q.trim())
  const visible = hasQuery ? matches : arenas
  const arenaPreview = visible.slice(0, ARENA_PREVIEW_LIMIT)
  const hasMore = hasQuery && matches.length > ARENA_PREVIEW_LIMIT
  const isLoading = arenasQuery.isPending || quadrasQuery.isPending
  const hasLoadError = arenasQuery.isError || quadrasQuery.isError

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: motionTokens.durations.base,
          ease: motionTokens.ease.out,
        }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <h1 className="text-tg-brand-text text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-bold">
          Reviva seus melhores lances
        </h1>
        <p className="text-muted-foreground max-w-xl text-sm md:text-base">
          Procure por cidade ou nome da arena, escolha a quadra e abra o replay
          dos últimos 7 dias.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: motionTokens.durations.slow,
          delay: 0.05,
          ease: motionTokens.ease.out,
        }}
        className="flex flex-col items-center gap-3"
      >
        <Video className="text-tg-brand-text size-14 md:size-16" />
        <div className="w-full max-w-2xl">
          <SearchCombobox
            value={q}
            onValueChange={(value) => setQ(value || null)}
            onSelect={handleSelect}
            fetchSuggestions={fetchSuggestions}
            placeholder="Qual cidade ou arena você procura?"
            emptyMessage="Nenhuma arena encontrada."
            size="hero"
          />
          {cities.length > 0 ? (
            <ul
              aria-label="Cidades"
              className="mt-3 flex flex-wrap justify-center gap-2"
            >
              {cities.map((city) => (
                <li key={city}>
                  <Button
                    type="button"
                    size="sm"
                    variant={q === city ? 'brand' : 'brandOutline'}
                    aria-pressed={q === city}
                    onClick={() => setQ(q === city ? null : city)}
                    className="min-h-touch-min rounded-full"
                  >
                    {city}
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </motion.div>

      {hasQuery ? null : <HowItWorks />}

      {hasQuery ? null : featuredReplay ? (
        <FeaturedCard replay={featuredReplay} />
      ) : null}

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-tg-brand-text text-lg font-bold">
            {hasQuery ? `Resultados para «${q.trim()}»` : 'Explore arenas'}
          </h2>
          <Link
            to="/app/arenas"
            className="text-tg-brand-text min-h-touch-min inline-flex items-center text-sm font-medium hover:underline md:min-h-0"
          >
            Ver todas →
          </Link>
        </div>
        {isLoading ? (
          <ul
            aria-busy="true"
            aria-live="polite"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: ARENA_PREVIEW_LIMIT }).map((_, i) => (
              <li key={i}>
                <ArenaCardSkeleton />
              </li>
            ))}
          </ul>
        ) : hasLoadError ? (
          <EmptyState
            ilustracao="sem-conexao"
            title="Não foi possível carregar as arenas"
            description="Confira se a API está no ar e tente novamente."
            action={
              <Button
                variant="brandOutline"
                onClick={() => {
                  void arenasQuery.refetch()
                  void quadrasQuery.refetch()
                }}
                disabled={arenasQuery.isRefetching}
                aria-busy={arenasQuery.isRefetching}
              >
                <RefreshCw
                  className={
                    arenasQuery.isRefetching ? 'animate-spin' : undefined
                  }
                />
                Tentar novamente
              </Button>
            }
          />
        ) : arenas.length === 0 ? (
          <EmptyState
            ilustracao="sem-arenas"
            title="Nenhuma arena cadastrada"
            description="Assim que uma arena for cadastrada, ela aparece aqui."
          />
        ) : hasQuery && matches.length === 0 ? (
          <EmptyState
            ilustracao="busca-vazia"
            title="Nenhuma arena encontrada"
            description="Tente outro termo: nome da arena ou cidade."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {arenaPreview.map((arena) => (
                <motion.li key={arena.id} variants={itemVariants}>
                  <ArenaCard
                    arena={arena}
                    quadrasCount={quadrasByArena.get(arena.id) ?? 0}
                  />
                </motion.li>
              ))}
            </motion.ul>
            {hasMore ? (
              <div className="flex justify-center">
                <Link
                  to={`/app/arenas?q=${encodeURIComponent(q.trim())}`}
                  className="text-tg-brand-text min-h-touch-min inline-flex items-center text-sm font-medium hover:underline md:min-h-0"
                >
                  Ver todas as arenas correspondentes →
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  )
}
