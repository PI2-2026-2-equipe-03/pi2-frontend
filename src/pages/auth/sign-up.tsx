import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Lock, Mail, Phone, User } from 'lucide-react'
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
import { registerUser } from '@/lib/api/auth'
import { getApiErrorMessage } from '@/lib/api/errors'
import { type SignUpInput, signUpSchema } from '@/lib/schemas/sign-up-schema'
import { PasswordRequirements } from '@/pages/auth/components/password-requirements'

export function SignUp() {
  const navigate = useNavigate()

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = useWatch({ control: form.control, name: 'password' })
  const confirmPassword = useWatch({
    control: form.control,
    name: 'confirmPassword',
  })

  const registerMutation = useMutation({
    mutationFn: registerUser,
  })

  async function onSubmit(data: SignUpInput) {
    try {
      const request = registerMutation.mutateAsync({
        name: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone,
      })
      void toast.promise(request, {
        loading: 'Criando conta…',
        success: 'Conta criada com sucesso',
        error: (error) =>
          getApiErrorMessage(error, 'Não foi possível criar a conta'),
      })
      await request
      navigate('/sign-in', { replace: true })
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Não foi possível criar a conta',
      )
      if (/e-mail|já cadastrado/i.test(message)) {
        form.setError('email', { message })
      } else {
        form.setError('root', { message })
      }
    }
  }

  const isSubmitting = registerMutation.isPending

  return (
    <div className="bg-card border-border w-full max-w-md rounded-xl border p-8 shadow-sm">
      <div className="mb-6 space-y-1">
        <h1 className="text-tg-brand-blue text-2xl font-bold">
          Criar sua conta
        </h1>
        <p className="text-muted-foreground text-sm">
          Cadastre-se para acessar os replays da arena.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
          aria-label="Formulário de criação de conta"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      type="text"
                      autoComplete="name"
                      placeholder="Seu nome completo"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      type="tel"
                      autoComplete="tel"
                      placeholder="(00) 00000-0000"
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

          {form.formState.errors.root?.message ? (
            <p role="alert" className="text-destructive text-sm">
              {form.formState.errors.root.message}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="brand"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Criando conta…
              </>
            ) : (
              'Criar conta'
            )}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Já possui uma conta?{' '}
            <Link
              to="/sign-in"
              className="text-primary rounded-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
            >
              Entrar
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
