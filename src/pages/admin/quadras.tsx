import { LayoutGrid, Trash2, VideoOff } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog'
import { EmptyState } from '@/components/empty-state'
import { QueryErrorState } from '@/components/query-error-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  indexById,
  useArenas,
  useCameras,
  useDeleteCamera,
  useDeleteQuadra,
  useQuadras,
} from '@/lib/api/queries'
import { getApiErrorMessage, isForbiddenError } from '@/lib/errors'
import type { Camera, Quadra } from '@/lib/types'

import { AdminPageHeader } from './components/admin-page-header'
import {
  CameraStatusBadge,
  QuadraStatusBadge,
} from './components/status-badges'
import { TableSkeleton } from './components/table-skeleton'

type QuadraRow = {
  quadra: Quadra
  arenaNome: string
  camera?: Camera
}

// arenaNome vai junto porque nomes de quadra se repetem entre arenas
// ("Quadra 01" em todas no seed): sem ele o modal não diz qual quadra é.
type DeleteTarget =
  | { kind: 'quadra'; quadra: Quadra; arenaNome: string }
  | { kind: 'camera'; camera: Camera; quadra: Quadra; arenaNome: string }

function quadraLabel(nome: string, arenaNome: string) {
  return arenaNome === '—' ? nome : `${nome} (${arenaNome})`
}

function dialogCopy(target: DeleteTarget | null) {
  if (target?.kind === 'camera') {
    return {
      title: `Excluir a câmera ${target.camera.identificador}?`,
      description: `A ${quadraLabel(target.quadra.nome, target.arenaNome)} deixa de gravar replays até uma nova câmera ser vinculada. Essa ação não pode ser desfeita.`,
    }
  }
  return {
    title: target
      ? `Excluir ${quadraLabel(target.quadra.nome, target.arenaNome)}?`
      : 'Excluir quadra?',
    description:
      'A quadra, a câmera vinculada e todos os replays gravados nela serão apagados. Essa ação não pode ser desfeita.',
  }
}

function DeleteButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 />
    </Button>
  )
}

function CameraCell({
  row,
  onDelete,
}: {
  row: QuadraRow
  onDelete: (camera: Camera) => void
}) {
  const { camera } = row
  if (!camera) {
    return (
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
        <VideoOff className="size-4" />
        Sem câmera
      </span>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{camera.identificador}</span>
      <CameraStatusBadge status={camera.status} />
      <DeleteButton
        label={`Excluir câmera ${camera.identificador}`}
        onClick={() => onDelete(camera)}
      />
    </div>
  )
}

// tela de gestão de quadras e câmeras — consulta + exclusão (F3-03)
export function AdminQuadras() {
  const quadrasQuery = useQuadras()
  const camerasQuery = useCameras()
  // nome da arena é detalhe: falha em /arenas não pode esconder a tabela
  const arenasQuery = useArenas()
  const deleteQuadra = useDeleteQuadra()
  const deleteCamera = useDeleteCamera()

  // target sobrevive ao `open` para o texto não sumir na animação de fechar
  const [target, setTarget] = useState<DeleteTarget | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const rows = useMemo<QuadraRow[]>(() => {
    const arenas = indexById(arenasQuery.data ?? [])
    const cameraByQuadra = new Map(
      (camerasQuery.data ?? []).map((camera) => [camera.quadraId, camera]),
    )
    return (quadrasQuery.data ?? []).map((quadra) => ({
      quadra,
      arenaNome: arenas.get(quadra.arenaId)?.nome ?? '—',
      camera: cameraByQuadra.get(quadra.id),
    }))
  }, [quadrasQuery.data, camerasQuery.data, arenasQuery.data])

  const isLoading = quadrasQuery.isPending || camerasQuery.isPending
  const isError = quadrasQuery.isError || camerasQuery.isError
  const isDeleting = deleteQuadra.isPending || deleteCamera.isPending

  function openDialog(next: DeleteTarget) {
    setTarget(next)
    setDialogOpen(true)
  }

  function handleRetry() {
    if (quadrasQuery.isError) void quadrasQuery.refetch()
    if (camerasQuery.isError) void camerasQuery.refetch()
  }

  function handleConfirm() {
    if (!target) return
    const callbacks = {
      onSuccess: () => {
        setDialogOpen(false)
        toast.success(
          target.kind === 'quadra' ? 'Quadra excluída' : 'Câmera excluída',
        )
      },
      onError: (error: unknown) => {
        // o modal global de 403 assume daqui: excluir de novo não adiantaria
        if (isForbiddenError(error)) {
          setDialogOpen(false)
          return
        }
        toast.error('Não foi possível excluir', {
          description: getApiErrorMessage(error, 'Tente novamente.'),
        })
      },
    }
    if (target.kind === 'quadra') {
      deleteQuadra.mutate(target.quadra.id, callbacks)
    } else {
      deleteCamera.mutate(target.camera.id, callbacks)
    }
  }

  const copy = dialogCopy(target)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <AdminPageHeader
        title="Gerenciar quadras"
        description="Visualize as quadras e as câmeras vinculadas a cada uma"
      />

      {isLoading ? (
        <TableSkeleton columns={5} />
      ) : isError ? (
        <QueryErrorState
          title="Não foi possível carregar as quadras"
          error={quadrasQuery.error ?? camerasQuery.error}
          onRetry={handleRetry}
          isRetrying={quadrasQuery.isFetching || camerasQuery.isFetching}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Nenhuma quadra cadastrada"
          description="As quadras da sua arena aparecem aqui assim que forem cadastradas."
        />
      ) : (
        <>
          <div className="bg-card hidden overflow-hidden rounded-2xl border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Quadra</TableHead>
                  <TableHead>Arena</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Câmera vinculada</TableHead>
                  <TableHead className="pr-4 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.quadra.id}>
                    <TableCell className="pl-4 font-medium">
                      {row.quadra.nome}
                    </TableCell>
                    <TableCell>{row.arenaNome}</TableCell>
                    <TableCell>
                      <QuadraStatusBadge disponivel={row.quadra.disponivel} />
                    </TableCell>
                    <TableCell>
                      <CameraCell
                        row={row}
                        onDelete={(camera) =>
                          openDialog({
                            kind: 'camera',
                            camera,
                            quadra: row.quadra,
                            arenaNome: row.arenaNome,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <DeleteButton
                        label={`Excluir ${quadraLabel(row.quadra.nome, row.arenaNome)}`}
                        onClick={() =>
                          openDialog({
                            kind: 'quadra',
                            quadra: row.quadra,
                            arenaNome: row.arenaNome,
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {rows.map((row) => (
              <li key={row.quadra.id}>
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {row.quadra.nome}
                      </p>
                      <p className="text-muted-foreground truncate text-sm">
                        {row.arenaNome}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <QuadraStatusBadge disponivel={row.quadra.disponivel} />
                      <DeleteButton
                        label={`Excluir ${quadraLabel(row.quadra.nome, row.arenaNome)}`}
                        onClick={() =>
                          openDialog({
                            kind: 'quadra',
                            quadra: row.quadra,
                            arenaNome: row.arenaNome,
                          })
                        }
                      />
                    </div>
                  </div>
                  <CameraCell
                    row={row}
                    onDelete={(camera) =>
                      openDialog({
                        kind: 'camera',
                        camera,
                        quadra: row.quadra,
                        arenaNome: row.arenaNome,
                      })
                    }
                  />
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDeleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={copy.title}
        description={copy.description}
        isPending={isDeleting}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
