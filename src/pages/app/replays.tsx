import { motion } from 'framer-motion'
import { Filter, Search, VideoOff } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'

import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Sport } from '@/lib/mocks'
import { REPLAYS, SPORT_LABEL } from '@/lib/mocks'
import { motionTokens } from '@/lib/motion'

import { ReplayCard } from './components/replay-card'

type SportFilter = Sport | 'todos'

const SPORT_TABS: readonly SportFilter[] = [
  'todos',
  'volei',
  'futebol',
  'tenis',
  'padel',
]

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

export function Replays() {
  const [esporte, setEsporte] = useQueryState<SportFilter>('esporte', {
    defaultValue: 'todos',
    parse: (value): SportFilter =>
      SPORT_TABS.includes(value as SportFilter)
        ? (value as SportFilter)
        : 'todos',
  })
  const [q, setQ] = useQueryState('q', { defaultValue: '' })

  const replaysFiltrados = useMemo(() => {
    const termo = q.trim().toLowerCase()
    return REPLAYS.filter((replay) => {
      const passaEsporte = esporte === 'todos' || replay.esporte === esporte
      const passaBusca =
        !termo || replay.titulo.toLowerCase().includes(termo)
      return passaEsporte && passaBusca
    })
  }, [esporte, q])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
            Meus replays
          </h1>
          <p className="text-tg-brand-blue font-medium">
            Assista, baixe ou compartilhe suas jogadas.
          </p>
        </div>
        <Button variant="brandOutline">
          <Filter className="size-4" />
          Filtrar
        </Button>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Tabs
          value={esporte}
          onValueChange={(value) => setEsporte(value as SportFilter)}
          className="w-full md:w-auto"
        >
          <TabsList>
            {SPORT_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab === 'todos' ? 'Todos' : SPORT_LABEL[tab]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="border-border bg-background focus-within:ring-tg-brand-blue/30 flex flex-1 items-center gap-2 rounded-full border px-4 py-2 shadow-sm transition-all focus-within:shadow-md focus-within:ring-4">
          <Search className="text-muted-foreground size-4" />
          <Input
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value || null)}
            placeholder="Buscar por título…"
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      {replaysFiltrados.length === 0 ? (
        <EmptyState
          icon={VideoOff}
          title="Nenhum replay encontrado"
          description="Tente ajustar o filtro de esporte ou o termo de busca."
        />
      ) : (
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {replaysFiltrados.map((replay) => (
            <motion.li key={replay.id} variants={itemVariants}>
              <ReplayCard replay={replay} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
