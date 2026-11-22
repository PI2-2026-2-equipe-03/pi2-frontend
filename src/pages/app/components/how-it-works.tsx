import type { LucideIcon } from 'lucide-react'
import { CalendarClock, CirclePlay, LayoutGrid, Search } from 'lucide-react'

type Step = {
  icon: LucideIcon
  title: string
  description: string
}

// explanatory copy, not a stepper: the prototype's four steps say what the
// product does, while the app itself stays a single search-and-filter screen
const STEPS: readonly Step[] = [
  {
    icon: Search,
    title: 'Busque sua arena',
    description: 'Por cidade ou pelo nome do lugar onde você jogou.',
  },
  {
    icon: LayoutGrid,
    title: 'Escolha a quadra',
    description: 'Cada arena lista as quadras que têm câmera.',
  },
  {
    icon: CalendarClock,
    title: 'Data e horário',
    description: 'Filtre pelo dia e pela hora em que a bola rolou.',
  },
  {
    icon: CirclePlay,
    title: 'Assista',
    description: 'Veja o replay e baixe antes de ele expirar.',
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="como-funciona" className="flex flex-col gap-4">
      <h2
        id="como-funciona"
        className="text-tg-brand-text text-center text-lg font-bold"
      >
        Como funciona
      </h2>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="border-border/60 bg-card flex flex-col gap-2 rounded-xl border p-4"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="bg-tg-brand-blue inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white tabular-nums"
              >
                {index + 1}
              </span>
              <step.icon className="text-tg-brand-text size-4 shrink-0" />
              <h3 className="text-foreground text-sm font-semibold">
                {step.title}
              </h3>
            </div>
            <p className="text-muted-foreground text-xs">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
