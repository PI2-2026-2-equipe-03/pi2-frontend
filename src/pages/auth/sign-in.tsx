import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginUser } from '@/lib/api/auth'
import { getMe } from '@/lib/api/me'
import { queryKeys } from '@/lib/api/queries'
import { authClient } from '@/lib/auth/client'
import {
  SESSION_EXPIRED_MESSAGE,
  toApiAuthError,
} from '@/lib/errors'
import { queryClient } from '@/lib/react-query'
import { type SignInInput, signInSchema } from '@/lib/schemas/sign-in-schema'

async function performSignIn(input: SignInInput): Promise<void> {
  await loginUser({ email: input.email, password: input.password })
  await authClient.getSession()
}

async function homePathAfterSignIn(): Promise<string> {
  try {
    const { data } = await queryClient.fetchQuery({
      queryKey: queryKeys.me,
      queryFn: getMe,
      staleTime: 0,
    })
    return data.role === 'ADM' ? '/admin' : '/app'
  } catch {
    return '/app'
  }
}

export function SignIn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('reason') === 'session-expired'

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: true },
  })

  const signInMutation = useMutation({
    mutationFn: performSignIn,
  })

  async function onSubmit(data: SignInInput) {
    try {
      const request = signInMutation.mutateAsync(data)
      void toast.promise(request, {
        loading: 'Autenticando…',
        success: 'Login realizado com sucesso',
        error: (error: Error) => error.message,
      })
      await request
      navigate(await homePathAfterSignIn(), { replace: true })
    } catch (error) {
      const authError = toApiAuthError(error, 'Usuário ou senha inválidos')
      const field =
        authError.field === 'email' || authError.field === 'password'
          ? authError.field
          : 'root'
      form.setError(field, { message: authError.message })
    }
  }

  const isSubmitting = signInMutation.isPending

  return (
    <div className="bg-card border-border w-full max-w-md rounded-xl border p-8 shadow-sm">
      <div className="mb-6 space-y-1">
        <h1 className="text-tg-brand-blue text-2xl font-bold">
          Entrar na sua conta
        </h1>
        <p className="text-muted-foreground text-sm">
          Acesse para baixar seus replays da arena.
        </p>
      </div>

      {sessionExpired ? (
        <p
          role="status"
          className="bg-muted text-foreground border-border mb-5 rounded-md border p-3 text-sm"
        >
          {SESSION_EXPIRED_MESSAGE}
        </p>
      ) : null}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
          aria-label="Formulário de login"
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Senha</FormLabel>
                  <Link
                    to="/forgot-password"
                    className="text-primary focus-visible:ring-ring/50 rounded-sm text-sm hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
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
            name="rememberMe"
            render={({ field }) => (
              <label className="text-muted-foreground flex w-fit items-center gap-2 text-sm">
                <Checkbox
                  ref={field.ref}
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  onBlur={field.onBlur}
                  className="data-[state=checked]:bg-tg-brand-blue data-[state=checked]:border-tg-brand-blue"
                />
                Lembrar de mim
              </label>
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
                Entrando…
              </>
            ) : (
              'Entrar'
            )}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Não possui uma conta?{' '}
            <Link
              to="/sign-up"
              className="text-primary focus-visible:ring-ring/50 rounded-sm font-medium hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Criar conta
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
