import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock, Mail, Phone, User } from 'lucide-react'
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
import { type SignUpInput, signUpSchema } from '@/lib/schemas/sign-up-schema'

// tela criar conta — baixa fidelidade, sem integração de auth ainda
export function SignUp() {
  const navigate = useNavigate()

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  })

  async function onSubmit(_data: SignUpInput) {
    toast.success('Conta criada com sucesso', {
      description: 'Você já pode acessar seus replays.',
    })
    navigate('/app', { replace: true })
  }

  const {
    formState: { isSubmitting },
  } = form

  return (
    <div className="bg-card border-border w-full max-w-md rounded-xl border p-8 shadow-sm">
      <div className="mb-6 space-y-1">
        <h1 className="text-tg-brand-blue text-2xl font-bold">Criar conta</h1>
        <p className="text-muted-foreground text-sm">
          Junte-se a nós e não perca nenhum momento.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
          aria-label="Formulário de cadastro"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                      autoComplete="name"
                      placeholder="Digite seu nome completo"
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
                      placeholder="Digite sua senha"
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
                      placeholder="Confirme sua senha"
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-tg-brand-yellow text-tg-brand-blue-dark hover:bg-tg-brand-yellow/90 w-full font-semibold shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
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
