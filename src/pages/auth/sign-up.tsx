import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Mail, Phone, User } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
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
import { Input } from '@/components/ui/input'
import { env } from '@/env'
import { registerUser as mockRegisterUser } from '@/lib/api/mocks/auth'
import { authClient } from '@/lib/auth/client'
import { saveMockSession } from '@/lib/auth/session'
import { AuthRequestError, toAuthRequestError } from '@/lib/errors'
import { formatPhone } from '@/lib/forms/phone-mask'
import { type SignUpInput, signUpSchema } from '@/lib/schemas/sign-up-schema'
import { PasswordRequirements } from '@/pages/auth/components/password-requirements'

// o cadastro já deixa o usuário autenticado: o Better Auth tem autoSignIn
// ligado por padrão e emite a cookie de sessão junto com o 200 do sign-up.
// por isso a tela segue direto pra /app — mandar pra /sign-in forçaria um
// segundo login e abandonaria a sessão recém-criada, que ficaria órfã no banco
// até expirar.
async function performSignUp(input: SignUpInput): Promise<void> {
  const data = {
    name: input.fullName,
    email: input.email,
    password: input.password,
    confirmPassword: input.confirmPassword,
    phone: input.phone,
  }

  if (env.VITE_USE_MOCKS) {
    const response = await mockRegisterUser(data)
    saveMockSession({
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
    })
    return;
  }

  const { error } = await authClient.signUp.email(data)

  if (error) {
    throw toAuthRequestError(error, 'Não foi possível criar a conta')
  }

  // mesmo motivo do sign-in: popula o atom reativo antes de navegar, senão o
  // guard do AppLayout vê null por um instante e devolve pra /sign-in.
  await authClient.getSession()
}

export function SignUp() {
  const navigate = useNavigate()

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    // onTouched: só mostra erro depois do primeiro blur; a partir daí
    // revalida a cada tecla. padrão UX moderno (menos agressivo que onChange
    // from zero mas ainda assim reativo).
    mode: 'onTouched',
    reValidateMode: 'onChange',
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

  const signUpMutation = useMutation({
    mutationFn: performSignUp,
  })

  async function onSubmit(data: SignUpInput) {
    try {
      const request = signUpMutation.mutateAsync(data)
      void toast.promise(request, {
        loading: 'Criando conta…',
        success: 'Conta criada com sucesso',
        error: (error: Error) => error.message,
      })
      await request
      navigate('/app', { replace: true })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a conta'
      const field = error instanceof AuthRequestError ? error.field : undefined
      form.setError(field ?? 'root', { message })
    }
  }

  const isSubmitting = signUpMutation.isPending

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
                <div className="relative">
                  <User
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    aria-hidden
                  />
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="name"
                      placeholder="Seu nome completo"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <div className="relative">
                  <Phone
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    aria-hidden
                  />
                  <FormControl>
                    <Input
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      placeholder="(00) 00000-0000"
                      className="pl-9"
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(formatPhone(event.target.value))
                      }
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
            aria-busy={isSubmitting}
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
