import { SlidersHorizontal } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export type ToolbarFilter = {
  id: string
  label: string
  control: ReactNode
  active: boolean
  width?: string
  position?: 'leading' | 'trailing'
}

type ListingToolbarProps = {
  search: ReactNode
  filters?: ToolbarFilter[]
  activeCount?: number
  onClearAll?: () => void
  className?: string
}

export function ListingToolbar({
  search,
  filters = [],
  activeCount = 0,
  onClearAll,
  className,
}: ListingToolbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const leading = filters.filter(
    (filter) => (filter.position ?? 'leading') === 'leading',
  )
  const trailing = filters.filter((filter) => filter.position === 'trailing')
  const hasFilters = filters.length > 0

  const desktopCols = [
    ...leading.map((filter) => filter.width ?? '12rem'),
    '1fr',
    ...trailing.map((filter) => filter.width ?? 'auto'),
  ].join(' ')

  return (
    <div
      data-slot="listing-toolbar"
      data-active-count={activeCount}
      className={cn(
        'bg-background/85 border-border/60 grid grid-cols-1 gap-3 rounded-xl border p-3 shadow-sm backdrop-blur-md md:items-center md:grid-cols-[var(--listing-toolbar-cols)]',
        className,
      )}
      style={
        { '--listing-toolbar-cols': desktopCols } as CSSProperties
      }
    >
      {leading.map((filter) => (
        <div
          key={filter.id}
          data-filter-id={filter.id}
          data-active={filter.active}
          className="hidden md:block"
        >
          {filter.control}
        </div>
      ))}
      <div
        data-slot="listing-toolbar-search"
        className={cn(hasFilters ? 'md:col-auto' : 'md:col-span-full')}
      >
        {search}
      </div>
      {trailing.map((filter) => (
        <div
          key={filter.id}
          data-filter-id={filter.id}
          data-active={filter.active}
          className="hidden md:block"
        >
          {filter.control}
        </div>
      ))}

      {hasFilters ? (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              aria-label={`Abrir filtros${activeCount > 0 ? ` (${activeCount} ativos)` : ''}`}
              className="md:hidden"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtros
              {activeCount > 0 ? (
                <span
                  aria-hidden
                  className="bg-tg-brand-blue ml-1 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-white tabular-nums"
                >
                  {activeCount}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="flex max-h-[85svh] flex-col gap-0 overflow-hidden rounded-t-2xl p-0"
          >
            <div
              aria-hidden
              className="bg-muted mx-auto mt-2 h-1 w-10 shrink-0 rounded-full"
            />
            <SheetHeader className="px-5 pt-3 pb-2">
              <SheetTitle className="flex items-center justify-between text-base">
                <span>Filtros</span>
                {activeCount > 0 ? (
                  <span className="text-muted-foreground text-sm font-normal">
                    {activeCount} {activeCount === 1 ? 'ativo' : 'ativos'}
                  </span>
                ) : null}
              </SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-4">
              {filters.map((filter) => (
                <div key={filter.id} className="flex flex-col gap-1.5">
                  <span className="text-foreground text-sm font-medium">
                    {filter.label}
                  </span>
                  <div
                    data-filter-id={filter.id}
                    data-active={filter.active}
                  >
                    {filter.control}
                  </div>
                </div>
              ))}
            </div>
            <SheetFooter className="border-border/60 flex-row gap-2 border-t px-5 py-4">
              {onClearAll ? (
                <Button
                  type="button"
                  variant="brandOutline"
                  className="flex-1"
                  onClick={() => {
                    onClearAll()
                  }}
                  disabled={activeCount === 0}
                >
                  Limpar
                </Button>
              ) : null}
              <Button
                type="button"
                variant="brand"
                className="flex-1"
                onClick={() => setSheetOpen(false)}
              >
                {onClearAll ? 'Aplicar' : 'Fechar'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  )
}
