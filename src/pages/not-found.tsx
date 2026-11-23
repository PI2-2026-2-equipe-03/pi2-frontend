import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

import { Ilustracao } from '@/components/ilustracao'
import {
  headerIconClasses,
  SiteHeader,
} from '@/components/navigation/site-header'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { useAuthSession } from '@/lib/auth/session'
import { transitions, useMotionSafe } from '@/lib/motion'

type NotFoundProps = {
  // inside /admin the page already lives in the layout's <main>, so it must not
  // paint its own full-screen frame over the sidebar and the header
  embedded?: boolean
}

// unknown route. never redirects on its own: a silent bounce to /sign-in is what
// made a live session look expired (issue #36)
export function NotFound({ embedded = false }: NotFoundProps) {
  const { pathname } = useLocation()
  const { data: session, isPending } = useAuthSession()
  const motionSafe = useMotionSafe()

  // the cta destination follows the session, so showing it before the probe
  // settles would offer the wrong way out
  if (isPending) return null

  const signedIn = Boolean(session)
  const backTo = signedIn ? '/app' : '/sign-in'

  const content = (
    <motion.div
      initial={motionSafe.prop({ opacity: 0, y: 12 })}
      animate={{ opacity: 1, y: 0 }}
      transition={motionSafe.transition(transitions.slideUp)}
      className="mx-auto flex max-w-md flex-col items-center gap-6 text-center"
    >
      <Ilustracao nome="nao-encontrado" className="w-56" />

      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em]">
          ERRO 404
        </p>
        <h1 className="text-tg-brand-blue dark:text-foreground text-2xl font-bold md:text-3xl">
          Essa página não existe
        </h1>
        <p className="text-muted-foreground text-sm">
          O endereço{' '}
          <span className="text-foreground font-mono break-all">
            {pathname}
          </span>{' '}
          não leva a nenhuma tela do repeteco. O link pode estar desatualizado
          ou a tela ainda está por vir.
        </p>
        {signedIn ? null : (
          <p className="text-muted-foreground text-sm">
            Sua sessão não está ativa: entre na sua conta para continuar.
          </p>
        )}
      </div>

      <Button asChild variant="brand" size="lg">
        <Link to={backTo}>
          {signedIn ? 'Voltar para o início' : 'Ir para o login'}
        </Link>
      </Button>
    </motion.div>
  )

  if (embedded) return content

  return (
    <div className="bg-tg-brand-bg text-foreground flex min-h-svh flex-col">
      <SiteHeader logoTo={backTo}>
        <ThemeToggle className={headerIconClasses} />
      </SiteHeader>
      <main className="flex flex-1 items-center justify-center p-4 pb-20">
        {content}
      </main>
    </div>
  )
}
