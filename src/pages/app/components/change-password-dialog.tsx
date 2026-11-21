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
import {
  type ChangePasswordFormInput,
  changePasswordSchema,
} from '@/lib/schemas/change-password-schema'
import { PasswordRequirements } from '@/pages/auth/components/password-requirements'

const EMPTY_FORM: ChangePasswordFormInput = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

// troca de senha do próprio usuário, em diálogo dentro do perfil: é ação
// pontual, e manter o contexto evita uma rota a mais.
export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const form = useForm<ChangePasswordFormInput>({
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

  const mutation = useMutation({ mutationFn: changePassword })
  const isSubmitting = mutation.isPending

  function handleOpenChange(next: boolean) {
    // fechar no meio da request deixaria o resultado sem dono
    if (isSubmitting) return
    setOpen(next)
    // senha não fica em memória depois que o diálogo fecha
    if (!next) form.reset(EMPTY_FORM)
  }

  async function onSubmit(data: ChangePasswordFormInput) {
    try {
      const result = await mutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setOpen(false)
      form.reset(EMPTY_FORM)

      if (result.sessionSurvived) {
        toast.success(
          'Senha alterada. As sessões nos outros aparelhos foram encerradas.',
        )
        return
      }
      // a sessão deste aparelho também caiu: avisa antes de mandar para o login
      toast.success('Senha alterada. Entre novamente com a nova senha.')
      navigate('/sign-in', { replace: true })
    } catch (error) {
      const field = error instanceof ChangePasswordError ? error.field : 'root'
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : 'Não foi possível alterar a senha'
      form.setError(field, { message })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-fit">
          <KeyRound className="size-4" />
          Alterar senha
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>
            Informe a senha atual e escolha uma nova. As sessões nos outros
            aparelhos serão encerradas.
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
