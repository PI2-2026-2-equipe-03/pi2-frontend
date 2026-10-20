import { Badge } from '@/components/ui/badge'
import type { CameraStatus } from '@/lib/types'

const CAMERA_STATUS: Record<
  CameraStatus,
  { label: string; variant: 'success' | 'secondary' | 'warning' }
> = {
  ativa: { label: 'Ativa', variant: 'success' },
  inativa: { label: 'Inativa', variant: 'secondary' },
  manutencao: { label: 'Manutenção', variant: 'warning' },
}

export function CameraStatusBadge({ status }: { status: CameraStatus }) {
  const { label, variant } = CAMERA_STATUS[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function QuadraStatusBadge({ disponivel }: { disponivel: boolean }) {
  return disponivel ? (
    <Badge variant="success">Ativa</Badge>
  ) : (
    <Badge variant="secondary">Inativa</Badge>
  )
}
