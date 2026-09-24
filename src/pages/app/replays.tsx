import { Video } from 'lucide-react'

import { ComingSoon } from '@/components/coming-soon'

export function Replays() {
  return (
    <ComingSoon
      icon={Video}
      title="Meus replays"
      description="Aqui você encontrará todos os clipes gerados nas suas partidas. Estamos preparando essa área para você."
    />
  )
}
