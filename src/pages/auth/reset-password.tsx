import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { resetPassword } from '@/lib/api/auth'
import { toApiAuthError } from '@/lib/errors'
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from '@/lib/schemas/reset-password-schema'
import { PasswordRequirements } from '@/pages/auth/components/password-requirements'

export function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  })

  const password = useWatch({ control: form.control, name: 'password' })
  const confirmPassword = useWatch({
    control: form.control,
    name: 'confirmPassword',
  })

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordInput) =>
      resetPassword({
        token: token!,
        password: data.password,
        passwordConfirmation: data.confirmPassword,
      }),
  })

  async function onSubmit(data: ResetPasswordInput) {
    try {
      const request = mutation.mutateAsync(data)
      void toast.promise(request, {
        loading: 'Salvando…',
        success: 'Senha redefinida com sucesso!',
        error: (error: Error) => error.message,
      })
      await request
      navigate('/sign-in', { replace: true })
    } catch (error) {
      const authError = toApiAuthError(
        error,
        'Não foi possível redefinir a senha',
      )
      const field = authError.field === 'password' ? 'password' : 'root'
      form.setError(field, { message: authError.message })
    }
  }

  const isSubmitting = mutation.isPending

  if (!token) {
    return (
      <div className="bg-card border-border w-full max-w-md rounded-xl border p-8 shadow-sm">
        <div className="space-y-3 text-center">
          <h1 className="text-tg-brand-blue text-2xl font-bold">
            Link inválido
          </h1>
          <p className="text-muted-foreground text-sm">
            O link de recuperação é inválido ou expirou. Solicite um novo.
          </p>
          <Link
            to="/forgot-password"
            className="text-primary inline-block text-sm font-medium hover:underline"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border-border w-full max-w-md rounded-xl border p-8 shadow-sm">
      <div className="mb-6 space-y-1">
        <h1 className="text-tg-brand-blue text-2xl font-bold">
          Redefinir senha
        </h1>
        <p className="text-muted-foreground text-sm">
          Crie uma nova senha para acessar sua conta.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
          aria-label="Formulário de redefinição de senha"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
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
                <FormLabel>Confirmar senha</FormLabel>
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
            password={password}
            confirmPassword={confirmPassword}
          />

          {form.formState.errors.root?.message ? (
            <p role="alert" className="text-destructive text-sm">
              {form.formState.errors.root.message}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="brand"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Salvando…
              </>
            ) : (
              'Redefinir senha'
            )}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Lembrou sua senha?{' '}
            <Link
              to="/sign-in"
              className="text-primary focus-visible:ring-ring/50 rounded-sm font-medium hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Entrar
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
