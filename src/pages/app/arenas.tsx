import { motion } from 'framer-motion'
import { MapPinOff, Search } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'

import { EmptyState } from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ARENAS } from '@/lib/mocks'
import { motionTokens } from '@/lib/motion'

import { ArenaCard } from './components/arena-card'

type Filter = 'todas' | 'favoritas'
const FILTROS: readonly Filter[] = ['todas', 'favoritas']
const CIDADE_TODAS = 'todas'

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

export function Arenas() {
  const [filtro, setFiltro] = useQueryState<Filter>('filtro', {
    defaultValue: 'todas',
    parse: (value): Filter =>
      FILTROS.includes(value as Filter) ? (value as Filter) : 'todas',
  })
  const [q, setQ] = useQueryState('q', { defaultValue: '' })
  const [cidade, setCidade] = useQueryState('cidade', {
    defaultValue: CIDADE_TODAS,
  })

  const cidadesDisponiveis = useMemo(() => {
    const set = new Set(ARENAS.map((a) => a.cidade))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [])

  const arenasFiltradas = useMemo(() => {
    const termo = q.trim().toLowerCase()
    return ARENAS.filter((arena) => {
      const passaFav = filtro === 'todas' || arena.favorita
      const passaCidade =
        cidade === CIDADE_TODAS || arena.cidade === cidade
      const passaBusca =
        !termo ||
        arena.nome.toLowerCase().includes(termo) ||
        arena.cidade.toLowerCase().includes(termo)
      return passaFav && passaCidade && passaBusca
    })
  }, [filtro, cidade, q])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-tg-brand-blue text-2xl font-bold md:text-3xl">
            Arenas
          </h1>
          <p className="text-tg-brand-blue font-medium">
            Explore locais parceiros e monte sua próxima partida.
          </p>
        </div>
        <Badge variant="outline" className="tabular-nums">
          {arenasFiltradas.length} de {ARENAS.length}
        </Badge>
      </header>

      <div className="bg-background/70 sticky top-0 z-sticky -mx-6 flex flex-col gap-3 px-6 py-3 backdrop-blur md:mx-0 md:flex-row md:items-center md:rounded-xl md:px-4">
        <Tabs
          value={filtro}
          onValueChange={(value) => setFiltro(value as Filter)}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="favoritas">Favoritas</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={cidade} onValueChange={setCidade}>
          <SelectTrigger className="md:w-52">
            <SelectValue placeholder="Cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CIDADE_TODAS}>Todas as cidades</SelectItem>
            {cidadesDisponiveis.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="border-border bg-background focus-within:ring-tg-brand-blue/30 flex flex-1 items-center gap-2 rounded-full border px-4 py-2 shadow-sm transition-all focus-within:shadow-md focus-within:ring-4">
          <Search className="text-muted-foreground size-4" />
          <Input
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value || null)}
            placeholder="Buscar por arena ou cidade…"
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      {arenasFiltradas.length === 0 ? (
        <EmptyState
          icon={MapPinOff}
          title="Nenhuma arena encontrada"
          description="Ajuste os filtros para ver mais locais parceiros."
        />
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
    </div>
  )
}
