import { Logo } from '@/components/logo'
import { Skeleton } from '@/components/ui/skeleton'

// shown while an area chunk is still in flight. the shell lives in the entry
// chunk, so switching areas never leaves the viewport blank.
export function RouteFallback() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="bg-background text-foreground flex min-h-svh flex-col"
    >
      <span className="sr-only">Carregando…</span>

      {/* the wordmark is real text: it also makes the paint a contentful one,
          so the measured first paint is what the user actually sees */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <Logo className="text-xl" />
        <Skeleton className="size-9 rounded-full" />
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, card) => (
            <Skeleton key={card} className="h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
