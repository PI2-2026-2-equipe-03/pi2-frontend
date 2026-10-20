import { Megaphone, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog'
import { EmptyState } from '@/components/empty-state'
import { QueryErrorState } from '@/components/query-error-state'
import { Badge } from '@/components/ui/badge'
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
  useDeletePatrocinador,
  usePatrocinadores,
  useQuadras,
} from '@/lib/api/queries'
import { getApiErrorMessage } from '@/lib/errors'
import type { Id, PatrocinadorView, Quadra } from '@/lib/types'

import { AdminPageHeader } from './components/admin-page-header'
import { SponsorLogo } from './components/sponsor-logo'
import { TableSkeleton } from './components/table-skeleton'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function LinkedQuadras({
  quadraIds,
  quadras,
}: {
  quadraIds: Id[]
  quadras: Map<Id, Quadra>
}) {
  if (quadraIds.length === 0) {
    return <span className="text-muted-foreground text-sm">Nenhuma</span>
  }
  // key pelo id: nomes de quadra se repetem entre arenas ("Quadra 01")
  const known = quadraIds
    .map((id) => quadras.get(id))
    .filter((quadra): quadra is Quadra => Boolean(quadra))
  // ids que a lista de quadras ainda não conhece contam, só que sem nome
  if (known.length === 0) {
    return (
      <span className="text-sm">
        {quadraIds.length} {quadraIds.length === 1 ? 'quadra' : 'quadras'}
      </span>
    )
  }
  return (
    <div className="flex flex-wrap gap-1">
      {known.map((quadra) => (
        <Badge key={quadra.id} variant="outline">
          {quadra.nome}
        </Badge>
      ))}
    </div>
  )
}

function DeleteButton({
  patrocinador,
  onClick,
}: {
  patrocinador: PatrocinadorView
  onClick: () => void
}) {
  const label = `Excluir ${patrocinador.nome}`
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

// tela de gestão de patrocinadores — consulta + exclusão (F3-03, RF-07)
export function AdminPatrocinadores() {
  const patrocinadoresQuery = usePatrocinadores()
  // só usado nos rótulos: falha em /quadras não pode esconder os patrocinadores
  const quadrasQuery = useQuadras()
  const deletePatrocinador = useDeletePatrocinador()

  // target sobrevive ao `open` para o texto não sumir na animação de fechar
  const [target, setTarget] = useState<PatrocinadorView | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const quadras = useMemo(
    () => indexById(quadrasQuery.data ?? []),
    [quadrasQuery.data],
  )
  const patrocinadores = patrocinadoresQuery.data ?? []

  function openDialog(patrocinador: PatrocinadorView) {
    setTarget(patrocinador)
    setDialogOpen(true)
  }

  function handleConfirm() {
    if (!target) return
    deletePatrocinador.mutate(target.id, {
      onSuccess: () => {
        setDialogOpen(false)
        toast.success('Patrocinador excluído')
      },
      onError: (error) => {
        toast.error('Não foi possível excluir', {
          description: getApiErrorMessage(error, 'Tente novamente.'),
        })
      },
    })
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <AdminPageHeader
        title="Patrocinadores"
        description="Visualize os patrocinadores exibidos nos replays das suas quadras"
      />

      {patrocinadoresQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : patrocinadoresQuery.isError ? (
        <QueryErrorState
          title="Não foi possível carregar os patrocinadores"
          error={patrocinadoresQuery.error}
          onRetry={() => void patrocinadoresQuery.refetch()}
          isRetrying={patrocinadoresQuery.isFetching}
        />
      ) : patrocinadores.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="Nenhum patrocinador cadastrado"
          description="Os patrocinadores vinculados às suas quadras aparecem aqui."
        />
      ) : (
        <>
          <div className="bg-card hidden overflow-hidden rounded-2xl border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Patrocinador</TableHead>
                  <TableHead>Quadras vinculadas</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="pr-4 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patrocinadores.map((patrocinador) => (
                  <TableRow key={patrocinador.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <SponsorLogo
                          nome={patrocinador.nome}
                          fotoUrl={patrocinador.fotoUrl}
                        />
                        <span className="font-medium">{patrocinador.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <LinkedQuadras
                        quadraIds={patrocinador.quadraIds}
                        quadras={quadras}
                      />
                    </TableCell>
                    <TableCell>{patrocinador.duracao}s</TableCell>
                    <TableCell>{currency.format(patrocinador.valor)}</TableCell>
                    <TableCell className="pr-4 text-right">
                      <DeleteButton
                        patrocinador={patrocinador}
                        onClick={() => openDialog(patrocinador)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {patrocinadores.map((patrocinador) => (
              <li key={patrocinador.id}>
                <Card className="gap-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <SponsorLogo
                        nome={patrocinador.nome}
                        fotoUrl={patrocinador.fotoUrl}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {patrocinador.nome}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {patrocinador.duracao}s ·{' '}
                          {currency.format(patrocinador.valor)}
                        </p>
                      </div>
                    </div>
                    <DeleteButton
                      patrocinador={patrocinador}
                      onClick={() => openDialog(patrocinador)}
                    />
                  </div>
                  <LinkedQuadras
                    quadraIds={patrocinador.quadraIds}
                    quadras={quadras}
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
        title={`Excluir ${target?.nome ?? 'patrocinador'}?`}
        description="O patrocinador deixa de aparecer nos replays de todas as quadras vinculadas. Essa ação não pode ser desfeita."
        isPending={deletePatrocinador.isPending}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
