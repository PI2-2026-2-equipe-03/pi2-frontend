import { motion } from 'framer-motion'
import { MapPin, Search, Star, Video } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ARENA_COVERS } from '@/lib/assets'

type Arena = {
  nome: string
  cidade: string
  distancia: string
  nota: number
  quadras: number
  extra: string
  cover: string
}

const ARENAS_FAVORITAS: readonly Arena[] = [
  {
    nome: 'Reriutaba Vôlei',
    cidade: 'Barra da Tijuca, RJ',
    distancia: '2.000 km',
    nota: 4.6,
    quadras: 4,
    extra: 'Estacionamento',
    cover: ARENA_COVERS.beachVolley1,
  },
  {
    nome: 'Vila Sport',
    cidade: 'Crateús, CE',
    distancia: '2 km',
    nota: 4.9,
    quadras: 4,
    extra: 'Estacionamento',
    cover: ARENA_COVERS.volleyIndoor,
  },
  {
    nome: 'Arena Charito',
    cidade: 'Ipueiras, CE',
    distancia: '40 km',
    nota: 4.8,
    quadras: 6,
    extra: 'Iluminação',
    cover: ARENA_COVERS.tennisCourt,
  },
]

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex justify-center"
      >
        <Video className="text-tg-brand-blue-dark size-24" />
      </motion.div>

      <div className="flex justify-center">
        <div className="border-border bg-background focus-within:ring-tg-brand-blue/30 flex w-full max-w-xl items-center gap-2 rounded-full border px-4 py-2 shadow-sm transition-all focus-within:shadow-md focus-within:ring-4">
          <Search className="text-muted-foreground size-4" />
          <Input
            type="search"
            placeholder="Qual cidade você está buscando?"
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <section>
        <h2 className="text-tg-brand-blue mb-3 text-lg font-bold">
          Arenas favoritas
        </h2>
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ARENAS_FAVORITAS.map((arena) => (
            <motion.li key={arena.nome} variants={itemVariants}>
              <Card className="group hover:border-tg-brand-blue/30 cursor-pointer overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={arena.cover}
                    alt={`Foto da arena ${arena.nome}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <Badge
                    variant="secondary"
                    className="bg-background/90 text-tg-brand-blue-dark absolute top-2 right-2 backdrop-blur"
                  >
                    <Star className="fill-tg-brand-yellow text-tg-brand-yellow size-3" />
                    {arena.nota}
                  </Badge>
                </div>
                <div className="space-y-1.5 p-3">
                  <p className="text-foreground group-hover:text-tg-brand-blue font-semibold transition-colors">
                    {arena.nome}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin className="size-3" />
                    {arena.distancia} • {arena.cidade}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="outline" className="text-2xs">
                      {arena.quadras} quadras
                    </Badge>
                    <Badge variant="outline" className="text-2xs">
                      {arena.extra}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </div>
  )
}
