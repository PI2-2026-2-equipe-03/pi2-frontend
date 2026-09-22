import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '@/lib/schemas/forgot-password-schema'

// tela de recuperação de senha — baixa fidelidade, ainda sem integração de auth
export function ForgotPassword() {
  const navigate = useNavigate()

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit() {
    // mock: sprint 2 chamará o backend para disparar o e-mail de recuperação
    toast.success('Verifique seu e-mail', {
      description:
        'Enviamos um link de recuperação de senha para o e-mail informado.',
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-tg-brand-yellow text-tg-brand-blue-dark hover:bg-tg-brand-yellow/90 w-full font-semibold"
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
