import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'

// B-01 (server pagination) does not exist and GET /replays still answers 500,
// so the pages are sliced here, on the client. every page boundary in the app
// lives in this file: when the api starts paginating, `queryFn` and
// `getNextPageParam` change and no screen has to.
export const CLIENT_PAGE_SIZE = 6

// the slice comes from the page index, never from "what is left over": a
// reactive filter that shrinks the source list cannot make the next page skip
// or repeat an item, because page n is always items[n*size .. n*size+size).
export function clientPageSlice<T>(
  items: readonly T[],
  pageIndex: number,
  pageSize: number,
): T[] {
  const start = Math.max(0, pageIndex) * pageSize
  return items.slice(start, start + pageSize)
}

type UseClientInfiniteListOptions<T> = {
  /**
   * must change whenever `items` changes — filters and the source's
   * `dataUpdatedAt` belong in here. the already loaded pages are cached under
   * this key, which is what brings the list back whole after the detail screen
   * unmounts it.
   */
  queryKey: readonly unknown[]
  items: readonly T[]
  pageSize?: number
  enabled?: boolean
}

export type UseClientInfiniteListResult<T> = {
  items: T[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isPending: boolean
  loadedPages: number
  fetchNextPage: () => void
}

export function useClientInfiniteList<T>({
  queryKey,
  items,
  pageSize = CLIENT_PAGE_SIZE,
  enabled = true,
}: UseClientInfiniteListOptions<T>): UseClientInfiniteListResult<T> {
  const query = useInfiniteQuery({
    queryKey,
    enabled,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => clientPageSlice(items, pageParam, pageSize),
    getNextPageParam: (_lastPage, _pages, lastPageParam) => {
      const next = lastPageParam + 1
      return next * pageSize < items.length ? next : undefined
    },
    // slicing a list that is already in memory costs nothing and must never
    // put the screen back into its loading state
    staleTime: Infinity,
  })

  const flat = useMemo(() => query.data?.pages.flat() ?? [], [query.data])

  // stable identity: the scroll sentinel observes on this callback, and a new
  // function every render would tear the observer down and rebuild it
  const live = useRef(query)
  live.current = query
  const fetchNextPage = useCallback(() => {
    const current = live.current
    if (current.hasNextPage && !current.isFetchingNextPage) {
      void current.fetchNextPage()
    }
  }, [])

  return {
    items: flat as T[],
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isPending: query.isPending,
    loadedPages: query.data?.pages.length ?? 0,
    fetchNextPage,
  }
}
