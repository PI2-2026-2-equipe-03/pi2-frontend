import { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'

export function Login() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/inicio')
  }

  return (
    <div className="min-h-screen bg-brand-blue-dark flex items-stretch">
      <section className="hidden md:flex flex-1 flex-col justify-between p-10 text-white bg-brand-blue-dark">
        <Logo className="text-3xl font-bold" />
        <div>
          <p className="text-3xl font-semibold leading-tight">
            Seus melhores momentos,
          </p>
          <p className="text-3xl font-semibold leading-tight">
            sempre com você.
          </p>
        </div>
        <div />
      </section>

      <section className="flex-1 flex items-center justify-center p-6 bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6"
          aria-label="Formulário de login"
        >
          <div className="md:hidden text-center text-brand-blue-dark">
            <Logo className="text-3xl font-bold" />
          </div>

          <h1 className="text-2xl font-bold text-brand-blue">Entrar na sua conta</h1>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="senha" className="text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-700">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              Lembrar de mim
            </label>
            <a href="#" className="text-brand-blue hover:underline">
              Esqueci minha senha
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-brand-yellow py-2.5 font-semibold text-brand-blue-dark hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-yellow/60"
          >
            Entrar
          </button>

          <p className="text-center text-sm text-slate-600">
            Não possui uma conta?{' '}
            <Link to="/login" className="font-medium text-brand-blue hover:underline">
              Criar conta
            </Link>
          </p>
        </form>
      </section>
    </div>
  )
}
