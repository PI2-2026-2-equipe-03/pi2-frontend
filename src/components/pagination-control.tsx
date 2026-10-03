import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type PaginationControlProps = {
  page: number
  totalPages: number
  onPageChange: (next: number) => void
  className?: string
}

// gera a sequência compacta de páginas com ellipsis quando necessário:
//   [1, 2, 3, 4, 5]              se totalPages <= 5
//   [1, '…', 4, 5, 6, '…', 10]   caso contrário, com janela ao redor da página
function buildPageSequence(page: number, total: number): Array<number | '…'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: Array<number | '…'> = [1]
  const windowStart = Math.max(2, page - 1)
  const windowEnd = Math.min(total - 1, page + 1)

  if (windowStart > 2) pages.push('…')
  for (let p = windowStart; p <= windowEnd; p++) pages.push(p)
  if (windowEnd < total - 1) pages.push('…')
  pages.push(total)
  return pages
}

export function PaginationControl({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationControlProps) {
  if (totalPages <= 1) return null

  const sequence = buildPageSequence(page, totalPages)

  return (
    <Pagination className={className}>
      <PaginationContent className="hidden sm:flex">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault()
              if (page > 1) onPageChange(page - 1)
            }}
            aria-disabled={page === 1}
            className={
              page === 1 ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>
        {sequence.map((entry, index) =>
          entry === '…' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink
                href="#"
                isActive={entry === page}
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(entry)
                }}
              >
                {entry}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault()
              if (page < totalPages) onPageChange(page + 1)
            }}
            aria-disabled={page === totalPages}
            className={
              page === totalPages
                ? 'pointer-events-none opacity-50'
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>

      {/* variante compacta mobile: Anterior / X de Y / Próxima */}
      <PaginationContent className="flex items-center gap-2 sm:hidden">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault()
              if (page > 1) onPageChange(page - 1)
            }}
            aria-disabled={page === 1}
            className={
              page === 1 ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>
        <PaginationItem>
          <span className="text-muted-foreground px-2 text-sm tabular-nums">
            {page} de {totalPages}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault()
              if (page < totalPages) onPageChange(page + 1)
            }}
            aria-disabled={page === totalPages}
            className={
              page === totalPages
                ? 'pointer-events-none opacity-50'
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
