import { motion } from 'framer-motion'
import { Search, SearchX, Video } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'

import { Input } from '@/components/ui/input'
import { ARENAS } from '@/lib/mocks'
import { motionTokens } from '@/lib/motion'

import { ArenaCard } from './components/arena-card'

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.durations.slow,
      ease: motionTokens.ease.out,
    },
  },
}

export function Home() {
  const [q, setQ] = useQueryState('q', { defaultValue: '' })

  const arenasFavoritas = useMemo(
    () => ARENAS.filter((arena) => arena.favorita),
    [],
  )

  const arenasFiltradas = useMemo(() => {
    if (!q.trim()) return arenasFavoritas
    const termo = q.trim().toLowerCase()
    return arenasFavoritas.filter(
      (arena) =>
        arena.nome.toLowerCase().includes(termo) ||
        arena.cidade.toLowerCase().includes(termo),
    )
  }, [q, arenasFavoritas])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: motionTokens.durations.base,
          ease: motionTokens.ease.out,
        }}
      >
        <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
          Selecione a arena
        </h1>
        <p className="text-tg-brand-blue font-medium">
          Reviva seus melhores momentos.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: motionTokens.durations.slow,
          delay: 0.1,
          ease: motionTokens.ease.out,
        }}
        className="flex justify-center"
      >
        <Video className="text-tg-brand-blue-dark size-24" />
      </motion.div>

      <div className="flex justify-center">
        <div className="border-border bg-background focus-within:ring-tg-brand-blue/30 flex w-full max-w-xl items-center gap-2 rounded-full border px-4 py-2 shadow-sm transition-all focus-within:shadow-md focus-within:ring-4">
          <Search className="text-muted-foreground size-4" />
          <Input
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value || null)}
            placeholder="Qual arena ou cidade você procura?"
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <section>
        <h2 className="text-tg-brand-blue mb-3 text-lg font-bold">
          Arenas favoritas
        </h2>

        {arenasFiltradas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-border bg-card/50 text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center"
          >
            <SearchX className="size-8" />
            <p className="text-sm">
              Nenhuma arena favorita encontrada para{' '}
              <span className="text-foreground font-medium">"{q}"</span>.
            </p>
          </motion.div>
        ) : (
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {arenasFiltradas.map((arena) => (
              <motion.li key={arena.id} variants={itemVariants}>
                <ArenaCard arena={arena} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>
    </div>
  )
}
