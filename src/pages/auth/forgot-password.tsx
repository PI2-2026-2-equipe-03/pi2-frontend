import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { forgotPassword } from '@/lib/api/auth'
import { toApiAuthError } from '@/lib/errors'
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '@/lib/schemas/forgot-password-schema'

export function ForgotPassword() {
  const navigate = useNavigate()

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
  })

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordInput) =>
      forgotPassword({ email: data.email }),
  })

  async function onSubmit(data: ForgotPasswordInput) {
    try {
      const request = mutation.mutateAsync(data)
      void toast.promise(request, {
        loading: 'Enviando…',
        success: 'Verifique seu e-mail',
        error: (error: Error) => error.message,
      })
      await request
      navigate('/sign-in', { replace: true })
    } catch (error) {
      const authError = toApiAuthError(
        error,
        'Não foi possível enviar o link de recuperação',
      )
      const field = authError.field === 'email' ? 'email' : 'root'
      form.setError(field, { message: authError.message })
    }
  }

  const isSubmitting = mutation.isPending

  return (
    <div className="bg-card border-border w-full max-w-md rounded-xl border p-8 shadow-sm">
      <div className="mb-6 space-y-1">
        <h1 className="text-tg-brand-blue text-2xl font-bold">
          Recuperar senha
        </h1>
        <p className="text-muted-foreground text-sm">
          Informe seu e-mail para receber o link de recuperação de senha.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
          aria-label="Formulário de recuperação de senha"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <div className="relative">
                  <Mail
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    aria-hidden
                  />
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="voce@arena.com"
                      className="pl-9"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
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
                Enviando…
              </>
            ) : (
              'Enviar link de recuperação'
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
