import { Skeleton } from '@/components/ui/skeleton'

type TableSkeletonProps = {
  columns: number
  rows?: number
}

// mesmo tamanho da tabela real, para o layout não pular ao carregar
export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="bg-card overflow-hidden rounded-2xl border"
    >
      <span className="sr-only">Carregando…</span>
      <div className="border-b px-4 py-3">
        <Skeleton className="h-4 w-1/3" />
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          className="flex items-center gap-6 border-b px-4 py-4 last:border-b-0"
        >
          {Array.from({ length: columns }, (_, col) => (
            <Skeleton
              key={col}
              className={col === columns - 1 ? 'size-8 shrink-0' : 'h-4 flex-1'}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
