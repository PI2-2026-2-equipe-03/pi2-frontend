import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ReplayCardSkeleton() {
  return (
    <Card className="shadow-card overflow-hidden rounded-2xl py-0">
      <Skeleton className="aspect-video rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/5" />
        </div>
        <div className="flex justify-between pt-2">
          <Skeleton className="h-7 w-14 rounded-md" />
          <div className="flex gap-1">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>
      </div>
    </Card>
  )
}
