import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Lock, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

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
import { getApiErrorMessage } from '@/lib/api/errors'
import { saveSession } from '@/lib/auth/session'
import { type SignInInput, signInSchema } from '@/lib/schemas/sign-in-schema'

export function SignIn() {
  const navigate = useNavigate()

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const loginMutation = useMutation({
    mutationFn: loginUser,
  })

  async function onSubmit(data: SignInInput) {
    try {
      const request = loginMutation.mutateAsync(data)
      void toast.promise(request, {
        loading: 'Autenticando…',
        success: 'Login realizado com sucesso',
        error: (error) =>
          getApiErrorMessage(error, 'Não foi possível entrar'),
      })
      const response = await request

      saveSession({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        token: response.data.token,
      })
      navigate('/app', { replace: true })
    } catch (error) {
      form.setError('password', {
        message: getApiErrorMessage(error, 'E-mail ou senha inválidos'),
      })
    }
  }

  const isSubmitting = loginMutation.isPending

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
                <FormControl>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="voce@arena.com"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
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
                    className="text-primary rounded-sm text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <Checkbox
              defaultChecked
              className="data-[state=checked]:bg-tg-brand-blue data-[state=checked]:border-tg-brand-blue"
            />
            Lembrar de mim
          </label>

          <Button
            type="submit"
            variant="brand"
            disabled={isSubmitting}
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
              className="text-primary rounded-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
            >
              Criar conta
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
