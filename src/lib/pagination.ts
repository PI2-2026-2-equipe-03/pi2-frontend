import { useQueryState } from 'nuqs'
import { useEffect, useMemo, useState } from 'react'

export const DEFAULT_PAGE_SIZE = 12

type UsePaginationOptions<T> = {
  items: readonly T[]
  pageSize?: number
  // quando passado, lê/escreve a página corrente na URL (ex. 'page')
  pageParam?: string
}

export type UsePaginationResult<T> = {
  page: number
  totalPages: number
  pageItems: T[]
  pageSize: number
  canPrev: boolean
  canNext: boolean
  setPage: (next: number) => void
  reset: () => void
}

function clampPage(page: number, total: number): number {
  if (total <= 1) return 1
  if (page < 1) return 1
  if (page > total) return total
  return page
}

export function usePagination<T>({
  items,
  pageSize = DEFAULT_PAGE_SIZE,
  pageParam,
}: UsePaginationOptions<T>): UsePaginationResult<T> {
  const [internalPage, setInternalPage] = useState(1)
  const [urlPage, setUrlPage] = useQueryState(pageParam ?? '__nop', {
    defaultValue: '1',
  })

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const raw = pageParam ? Number(urlPage) || 1 : internalPage
  const page = clampPage(raw, totalPages)

  // mantém a URL sincronizada caso a página clampada diverja do bruto (ex. depois
  // de um filtro que encolheu totalPages).
  useEffect(() => {
    if (!pageParam) return
    if (String(page) !== urlPage) {
      setUrlPage(page === 1 ? null : String(page))
    }
  }, [page, pageParam, setUrlPage, urlPage])

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  function setPage(next: number): void {
    const clamped = clampPage(next, totalPages)
    if (pageParam) {
      setUrlPage(clamped === 1 ? null : String(clamped))
    } else {
      setInternalPage(clamped)
    }
  }

  function reset(): void {
    setPage(1)
  }

  return {
    page,
    totalPages,
    pageItems,
    pageSize,
    canPrev: page > 1,
    canNext: page < totalPages,
    setPage,
    reset,
  }
}
