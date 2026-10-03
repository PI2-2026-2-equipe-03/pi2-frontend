import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ArenaCardSkeleton() {
  return (
    <Card className="shadow-card overflow-hidden rounded-2xl py-0">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-1.5 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </Card>
  )
}
