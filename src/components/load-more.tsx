import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// the sentinel fires a third of a viewport early, so the next page is on its
// way before the list ends up behind the fixed bottom nav
const SENTINEL_MARGIN = '0px 0px 33% 0px'

type LoadMoreProps = {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  /** how many items are on screen, for the end-of-list status */
  loadedCount: number
  totalCount: number
  /** singular/plural noun for the status line, e.g. "replay" */
  itemLabel?: string
  className?: string
}

/**
 * Infinite scroll with a way out: the sentinel loads the next page on scroll,
 * and the button does the same thing for anyone who is not scrolling — the
 * gesture alone is a dead end for keyboard and screen reader users.
 */
export function LoadMore({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  loadedCount,
  totalCount,
  itemLabel = 'item',
  className,
}: LoadMoreProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLParagraphElement | null>(null)
  // the button unmounts with the last page; focus has to land somewhere, and
  // only when it was the button that got us here
  const cameFromButton = useRef(false)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    if (!hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore()
      },
      { rootMargin: SENTINEL_MARGIN },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasNextPage, onLoadMore])

  useEffect(() => {
    if (hasNextPage) return
    if (!cameFromButton.current) return
    cameFromButton.current = false
    endRef.current?.focus()
  }, [hasNextPage])

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      {hasNextPage ? (
        <>
          <Button
            variant="brandOutline"
            // size="sm" would be 36px, under the 44px floor
            className="min-h-touch-min px-6"
            aria-busy={isFetchingNextPage}
            disabled={isFetchingNextPage}
            onClick={() => {
              cameFromButton.current = true
              onLoadMore()
            }}
          >
            {isFetchingNextPage ? (
              <Loader2 className="size-4 animate-spin md:size-5" aria-hidden />
            ) : null}
            Carregar mais
          </Button>
          <p role="status" aria-live="polite" className="sr-only">
            {`${loadedCount} de ${totalCount} ${itemLabel}s carregados`}
          </p>
        </>
      ) : totalCount > 0 ? (
        <p
          ref={endRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="text-muted-foreground text-sm focus-visible:outline-none"
        >
          {totalCount === 1
            ? `1 ${itemLabel} carregado. Fim da lista.`
            : `${totalCount} ${itemLabel}s carregados. Fim da lista.`}
        </p>
      ) : null}
    </div>
  )
}
