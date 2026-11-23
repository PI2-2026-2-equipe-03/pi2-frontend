import { X } from 'lucide-react'
import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from 'react'
import { useEffect, useRef } from 'react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useMotionSafe } from '@/lib/motion'
import { cn } from '@/lib/utils'

// a short drag is a mis-grab; past a quarter of the panel, or on a quick
// flick, the gesture reads as "dismiss"
const DISMISS_RATIO = 0.25
const DISMISS_VELOCITY = 0.6
const DISMISS_MS = 180

type DragHandlers = {
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void
}

type DragState = {
  pointerId: number
  startY: number
  startedAt: number
  offset: number
}

// drag-to-dismiss is a shortcut, never the only way out: the close button and
// escape (radix) stay wired whatever the pointer does
function useDragDismiss(
  contentRef: RefObject<HTMLDivElement | null>,
  onDismiss: () => void,
): DragHandlers {
  const dragRef = useRef<DragState | null>(null)
  const timerRef = useRef(0)
  const { shouldReduce } = useMotionSafe()

  useEffect(() => {
    return () => {
      if (timerRef.current !== 0) window.clearTimeout(timerRef.current)
    }
  }, [])

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    // the header doubles as the grab area, so a tap on the close button — or
    // on anything else interactive up there — must not become a drag.
    // [role="button"] earns its place: the quadra card is a div, not a button
    const target = event.target as HTMLElement
    if (
      target.closest(
        'button, a, input, select, textarea, label, [role="button"]',
      )
    ) {
      return
    }
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const node = contentRef.current
    if (!node) return

    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startedAt: performance.now(),
      offset: 0,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    node.style.transition = 'none'
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const node = contentRef.current
    if (!node) return

    // downward only: pulling up would unstick the panel from the screen edge
    drag.offset = Math.max(0, event.clientY - drag.startY)
    node.style.transform = `translate3d(0, ${drag.offset}px, 0)`
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null

    const node = contentRef.current
    if (!node) return

    const elapsed = Math.max(1, performance.now() - drag.startedAt)
    const dismiss =
      drag.offset > node.offsetHeight * DISMISS_RATIO ||
      drag.offset / elapsed > DISMISS_VELOCITY

    if (!dismiss) {
      node.style.transition = shouldReduce
        ? 'none'
        : `transform ${DISMISS_MS}ms ease-out`
      node.style.transform = ''
      return
    }

    if (shouldReduce) {
      node.style.transition = ''
      node.style.transform = ''
      onDismiss()
      return
    }

    // radix would replay its slide-out from translateY(0) and snap the panel
    // back up first, so the gesture finishes the slide itself and then drops
    // the exit animation — otherwise the sheet appears to close twice
    node.style.transition = `transform ${DISMISS_MS}ms ease-out`
    node.style.transform = `translate3d(0, ${node.offsetHeight}px, 0)`
    timerRef.current = window.setTimeout(() => {
      timerRef.current = 0
      node.style.animation = 'none'
      onDismiss()
    }, DISMISS_MS)
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  }
}

export type BottomSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** rendered inside a trigger; omit to drive the sheet from outside */
  trigger?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** sits at the end of the title row, e.g. a count of active filters */
  titleAside?: ReactNode
  footer?: ReactNode
  showCloseButton?: boolean
  /**
   * for a sheet opened from inside another one: an overlay at z-overlay (60)
   * would slide under the sheet below (z-modal 70) and leave it undimmed
   */
  nested?: boolean
  className?: string
  bodyClassName?: string
  footerClassName?: string
  children: ReactNode
}

export function BottomSheet({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  titleAside,
  footer,
  showCloseButton = true,
  nested = false,
  className,
  bodyClassName,
  footerClassName,
  children,
}: BottomSheetProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const dragHandlers = useDragDismiss(contentRef, () => onOpenChange(false))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      <SheetContent
        // reaches SheetPrimitive.Content because react 19 passes ref as a
        // plain prop; on react 18 this would be dropped in silence and the
        // drag would quietly do nothing
        ref={contentRef}
        side="bottom"
        showCloseButton={false}
        // important because tailwind-merge can't dedupe two named z utilities,
        // and the base z-overlay happens to win on css order
        overlayClassName={nested ? 'z-modal!' : undefined}
        // alongside data-slot, never over it: ui/sheet.tsx writes
        // data-slot="sheet-content" before spreading props, so overwriting it
        // would hide every bottom sheet from a selector aimed at sheets
        data-bottom-sheet=""
        className={cn(
          'flex max-h-[85svh] flex-col gap-0 overflow-hidden rounded-t-2xl p-0',
          className,
        )}
      >
        <div {...dragHandlers} className="shrink-0 touch-none">
          <div
            aria-hidden
            className="bg-muted mx-auto mt-2 h-1 w-10 rounded-full"
          />
          <SheetHeader
            className={cn('px-5 pt-3 pb-2', showCloseButton && 'pr-16')}
          >
            <SheetTitle className="flex items-center justify-between text-base">
              <span>{title}</span>
              {titleAside}
            </SheetTitle>
            {description ? (
              <SheetDescription>{description}</SheetDescription>
            ) : null}
          </SheetHeader>
        </div>

        {showCloseButton ? (
          <SheetClose
            aria-label="Fechar"
            className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 size-touch-min absolute top-2 right-3 inline-flex items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-5" aria-hidden />
          </SheetClose>
        ) : null}

        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-4',
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer ? (
          // the sheet covers the bottom nav (overlay 60 > nav 50), so the safe
          // area the nav used to hold is now this footer's job
          <SheetFooter
            className={cn(
              'border-border/60 flex-row gap-2 border-t px-5 pt-4 pb-[calc(1rem+var(--tg-safe-area-bottom))]',
              footerClassName,
            )}
          >
            {footer}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
