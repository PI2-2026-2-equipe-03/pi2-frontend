import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// mantém o mesmo shape visual do ArenaCard para evitar salto ao carregar
export function ArenaCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0">
      <Skeleton className="h-32 rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>
      </div>
    </Card>
  )
}
