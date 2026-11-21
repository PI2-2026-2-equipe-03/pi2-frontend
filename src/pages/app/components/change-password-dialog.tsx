import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { KeyRound, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { changePassword, ChangePasswordError } from '@/lib/auth/change-password'
import { signOut } from '@/lib/auth/session'
import {
  type ChangePasswordInput,
  changePasswordSchema,
} from '@/lib/schemas/change-password-schema'
import { PasswordRequirements } from '@/pages/auth/components/password-requirements'

const EMPTY_FORM: ChangePasswordInput = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

// one-off action, so a dialog inside the profile instead of its own route
export function ChangePasswordDialog() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: EMPTY_FORM,
  })

  const newPassword = useWatch({ control: form.control, name: 'newPassword' })
  const confirmPassword = useWatch({
    control: form.control,
    name: 'confirmPassword',
  })

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordInput) =>
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
  })

  function handleOpenChange(next: boolean) {
    setOpen(next)
    // typed passwords should not linger in memory after closing
    if (!next) form.reset(EMPTY_FORM)
  }

  async function onSubmit(data: ChangePasswordInput) {
    try {
      const { sessionAlive } = await mutation.mutateAsync(data)

      if (sessionAlive) {
        toast.success('Senha alterada com sucesso', {
          description: 'Suas outras sessões foram encerradas por segurança.',
        })
        handleOpenChange(false)
        return
      }

      // session dropped with the others: warn before leaving the authenticated
      // area, so the user is never ejected to the login screen without a reason
      toast.success('Senha alterada com sucesso', {
        description:
          'Todas as sessões foram encerradas. Entre novamente com a nova senha.',
        duration: 10000,
      })
      handleOpenChange(false)
      await signOut()
      navigate('/sign-in', { replace: true })
    } catch (error) {
      const field = error instanceof ChangePasswordError ? error.field : 'root'
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : 'Não foi possível alterar a senha'
      form.setError(field, { message }, { shouldFocus: field !== 'root' })
    }
  }

  const isSubmitting = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full sm:w-fit">
          <KeyRound className="size-4" />
          Alterar senha
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>
            Confirme a senha atual e escolha uma nova. As outras sessões serão
            encerradas.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
            aria-label="Formulário de alteração de senha"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha atual</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PasswordRequirements
              password={newPassword}
              confirmPassword={confirmPassword}
            />

            {form.formState.errors.root?.message ? (
              <p role="alert" className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            ) : null}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="brand"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Salvando…
                  </>
                ) : (
                  'Alterar senha'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
