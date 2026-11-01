import { useSyncExternalStore } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  hideForbidden,
  isForbiddenOpen,
  subscribeForbidden,
} from '@/lib/auth/forbidden-signal'
import { FORBIDDEN_MESSAGE } from '@/lib/errors'

// aberto pelo interceptor do axios em qualquer resposta 403 da api
export function ForbiddenDialog() {
  const open = useSyncExternalStore(subscribeForbidden, isForbiddenOpen)

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) hideForbidden()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-tg-brand-blue dark:text-foreground">
            Acesso não permitido
          </AlertDialogTitle>
          <AlertDialogDescription>{FORBIDDEN_MESSAGE}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Entendi</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
