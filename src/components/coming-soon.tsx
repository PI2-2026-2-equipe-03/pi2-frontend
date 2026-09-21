import { motion } from 'framer-motion'
import { Construction, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

type ComingSoonProps = {
  title: string
  description?: string
  icon?: LucideIcon
  backTo?: string
  backLabel?: string
}

// placeholder padrão para telas ainda não implementadas
// mantém o layout do app e sinaliza claramente o estado "em construção"
export function ComingSoon({
  title,
  description = 'Esta funcionalidade está em construção e chega em breve.',
  icon: Icon = Construction,
  backTo = '/app',
  backLabel = 'Voltar para o início',
}: ComingSoonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-10 text-center"
    >
      <div className="bg-tg-brand-yellow/15 ring-tg-brand-yellow/30 flex size-24 items-center justify-center rounded-full ring-8">
        <Icon className="text-tg-brand-blue size-10" />
      </div>

      <div className="space-y-2">
        <span className="bg-tg-brand-yellow/20 text-tg-brand-blue-dark inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
          Tela em construção
        </span>
        <h1 className="text-tg-brand-blue text-3xl font-bold md:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md">{description}</p>
      </div>

      <Button asChild variant="outline">
        <Link to={backTo}>{backLabel}</Link>
      </Button>
    </motion.div>
  )
}
