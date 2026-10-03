import { motion } from 'framer-motion'
import { MapPin, SearchX, Video } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/empty-state'
import { FeaturedCard } from '@/components/featured-card'
import { SearchCombobox } from '@/components/search-combobox'
import { ARENAS, REPLAY_VIEWS } from '@/lib/mocks'
import { motionTokens } from '@/lib/motion'
import type { CourtMatch, Suggestion } from '@/lib/search'
import { courtSuggestions, suggestCourts } from '@/lib/search'
import { useFakeLoading } from '@/lib/use-fake-loading'

import { ArenaCard } from './components/arena-card'
import { ArenaCardSkeleton } from './components/arena-card-skeleton'

// seleciona o replay mais recente disponível pra alimentar o FeaturedCard.
// projeção pura — nenhum campo novo na entidade.
const featuredReplay = [...REPLAY_VIEWS]
  .filter((r) => r.status === 'available')
  .sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  )[0]

const RESULT_PREVIEW_LIMIT = 12

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
  const [matches, setMatches] = useState<CourtMatch[]>([])
  const isLoading = useFakeLoading()

  useEffect(() => {
    let cancelled = false
    suggestCourts(q).then((res) => {
      if (!cancelled) setMatches(res)
    })
    return () => {
      cancelled = true
    }
  }, [q])

  function handleSelect(suggestion: Suggestion) {
    if (suggestion.payload.kind === 'court') {
      navigate(`/app/replays?court=${suggestion.payload.value}`)
    }
  }

  const hasQuery = Boolean(q.trim())
  const preview = matches.slice(0, RESULT_PREVIEW_LIMIT)
  const hasMore = matches.length > RESULT_PREVIEW_LIMIT

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
        <h1 className="text-tg-brand-blue text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-bold">
          Reviva seus melhores lances
        </h1>
        <p className="text-muted-foreground max-w-xl text-sm md:text-base">
          Encontre sua quadra pelo nome ou pela cidade e abra o replay dos
          últimos 7 dias.
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
        <Video className="text-tg-brand-blue-dark size-14 md:size-16" />
        <div className="w-full max-w-2xl">
          <SearchCombobox
            value={q}
            onValueChange={(value) => setQ(value || null)}
            onSelect={handleSelect}
            fetchSuggestions={courtSuggestions}
            placeholder="Qual quadra ou cidade você procura?"
            emptyMessage="Nenhuma quadra encontrada."
            size="hero"
          />
        </div>
      </motion.div>

      {hasQuery ? (
        preview.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nenhuma quadra encontrada"
            description="Tente outro termo — nome da quadra, da arena ou da cidade."
          />
        ) : (
          <section className="flex flex-col gap-4">
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {preview.map(({ quadra, arena }) => (
                <motion.li key={quadra.id} variants={itemVariants}>
                  <Link
                    to={`/app/replays?court=${quadra.id}`}
                    className="hover:border-tg-brand-blue/30 focus-visible:ring-ring/40 bg-card flex items-center gap-3 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-4 focus-visible:outline-none"
                  >
                    <img
                      src={arena.fotoUrl}
                      alt=""
                      className="size-14 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate font-semibold">
                        {quadra.nome}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1 truncate text-xs">
                        <MapPin className="size-3 shrink-0" />
                        {arena.nome} · {arena.cidade}
                      </p>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            {hasMore ? (
              <div className="flex justify-center">
                <Link
                  to={`/app/replays?q=${encodeURIComponent(q)}`}
                  className="text-tg-brand-blue hover:underline text-sm font-medium"
                >
                  Ver todos os replays correspondentes →
                </Link>
              </div>
            ) : null}
          </section>
        )
      ) : (
        <>
          {featuredReplay ? <FeaturedCard replay={featuredReplay} /> : null}

          <section>
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-tg-brand-blue text-lg font-bold">
                Explore arenas
              </h2>
              <Link
                to="/app/arenas"
                className="text-tg-brand-blue hover:underline text-xs font-medium"
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
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <ArenaCardSkeleton />
                </li>
              ))}
            </ul>
          ) : (
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {ARENAS.map((arena) => (
                <motion.li key={arena.id} variants={itemVariants}>
                  <ArenaCard arena={arena} />
                </motion.li>
              ))}
            </motion.ul>
          )}
          </section>
        </>
      )}
    </div>
  )
}
