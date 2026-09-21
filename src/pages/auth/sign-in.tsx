import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

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
import { type SignInInput, signInSchema } from '@/lib/schemas/sign-in-schema'

// tela login — baixa fidelidade, ainda sem integração de auth
// aceita qualquer e-mail/senha válidos pelo schema e navega para /app
export function SignIn() {
  const navigate = useNavigate()

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(_data: SignInInput) {
    // mock: sprint 2 chamará o backend
    navigate('/app', { replace: true })
  }

  const {
    formState: { isSubmitting },
  } = form

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
                    to="#"
                    tabIndex={-1}
                    className="text-primary text-sm hover:underline"
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
            <input
              type="checkbox"
              defaultChecked
              className="border-input text-primary focus:ring-ring size-4 rounded"
            />
            Lembrar de mim
          </label>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-tg-brand-yellow text-tg-brand-blue-dark hover:bg-tg-brand-yellow/90 w-full font-semibold"
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
              to="/sign-in"
              className="text-primary font-medium hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
