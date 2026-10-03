import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ReplayExpiry } from '@/components/replay-expiry'
import { motionTokens } from '@/lib/motion'
import type { ReplayView } from '@/lib/types'

type FeaturedCardProps = {
  replay: ReplayView
}

// card de destaque na Home — primeira impressão rica em vez de só grid.
// consome um ReplayView real (replay mais recente, por padrão) sem inventar campos.
export function FeaturedCard({ replay }: FeaturedCardProps) {
  const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(replay.recordedAt))

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: motionTokens.durations.slow,
        delay: 0.1,
        ease: motionTokens.ease.out,
      }}
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md md:aspect-[21/9]"
    >
      {/* camada 1 — foto da arena */}
      <img
        src={replay.arena.fotoUrl}
        alt=""
        loading="eager"
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* camada 2 — gradient brand sobre a foto, com peso maior na esquerda pro texto respirar */}
      <div className="from-tg-brand-blue-dark/90 via-tg-brand-blue/60 absolute inset-0 bg-gradient-to-r to-transparent md:to-transparent" />
      <div className="from-tg-brand-yellow/40 absolute inset-0 bg-gradient-to-tr via-transparent to-transparent mix-blend-overlay" />

      {/* camada 3 — conteúdo */}
      <div className="relative flex h-full flex-col justify-between gap-4 p-5 text-white md:p-8">
        <div className="flex items-start justify-between gap-3">
          <span className="bg-white/15 border-white/25 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur">
            Replay em destaque
          </span>
          <ReplayExpiry
            expiresAt={replay.expiresAt}
            className="bg-white/15 border-white/25 text-white"
          />
        </div>

        <div className="max-w-lg space-y-2">
          <p className="text-sm font-medium text-white/80 md:text-base">
            {replay.arena.nome}
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-bold tracking-tight">
            {replay.court.nome}
          </h2>
          <p className="text-white/85 flex items-center gap-1.5 text-sm">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {replay.city} · {dateLabel}
          </p>

          <Link
            to={`/app/replays?court=${replay.court.id}`}
            className="bg-tg-brand-yellow text-tg-brand-blue-dark hover:bg-tg-brand-yellow/90 focus-visible:ring-white/60 mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
          >
            Ver replay
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
