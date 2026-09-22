import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
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
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from '@/lib/schemas/reset-password-schema'
import { PasswordRequirements } from '@/pages/auth/components/password-requirements'

// tela de redefinição de senha — baixa fidelidade, ainda sem integração de auth
export function ResetPassword() {
  const navigate = useNavigate()

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const password = useWatch({ control: form.control, name: 'password' })
  const confirmPassword = useWatch({
    control: form.control,
    name: 'confirmPassword',
  })

  async function onSubmit() {
    // mock: sprint 2 chamará o backend para efetivamente trocar a senha
    toast.success('Senha redefinida com sucesso!', {
      description: 'Você já pode entrar com sua nova senha.',
    })
    navigate('/sign-in', { replace: true })
  }

  const {
    formState: { isSubmitting },
  } = form

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
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      type="password"
                      autoComplete="new-password"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      type="password"
                      autoComplete="new-password"
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

          {/* feedback visual dos requisitos de senha, atualizado em tempo real */}
          <PasswordRequirements
            password={password}
            confirmPassword={confirmPassword}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-tg-brand-yellow text-tg-brand-blue-dark hover:bg-tg-brand-yellow/90 w-full font-semibold"
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
              className="text-primary font-medium hover:underline"
            >
              Entrar
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
