import { NavLink, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'

const NAV_ITEMS = [
  { label: 'Início', to: '/inicio' },
  { label: 'Meus replays', to: '/inicio' },
  { label: 'Arenas', to: '/inicio' },
  { label: 'Quadras', to: '/inicio' },
]

const ARENAS_FAVORITAS = [
  { nome: 'Reriutaba Vôlei', cidade: 'Barra da Tijuca, RJ', distancia: '2.000 km', nota: 4.6, quadras: 4, extras: 'Parking' },
  { nome: 'Vila - Sport', cidade: 'Crateús, CE', distancia: '2 km', nota: 4.9, quadras: 4, extras: 'Parking' },
  { nome: 'Arena Charito', cidade: 'Ipueiras, CE', distancia: '40 km', nota: 4.8, quadras: 6, extras: 'Lighting' },
]

export function Inicio() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <header className="bg-brand-blue text-white px-6 py-4 flex items-center justify-between">
        <Logo className="text-2xl font-bold" />
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Favoritos"
            className="h-9 w-9 rounded-full border border-white/40 grid place-items-center hover:bg-white/10"
          >
            ★
          </button>
          <button
            type="button"
            aria-label="Perfil"
            className="h-9 w-9 rounded-full border border-white/40 grid place-items-center hover:bg-white/10"
          >
            👤
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="hidden md:flex w-56 flex-col justify-between bg-brand-blue-dark text-white py-6">
          <nav className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item, index) => (
              <NavLink
                key={item.label}
                to={item.to}
                end
                className={({ isActive }) =>
                  [
                    'rounded-md px-3 py-2 font-medium',
                    isActive && index === 0
                      ? 'bg-brand-yellow text-brand-blue-dark'
                      : 'text-white/90 hover:bg-white/10',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-col gap-1 px-3">
            <button
              type="button"
              className="text-left rounded-md px-3 py-2 text-white/90 hover:bg-white/10"
            >
              Perfil
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-left rounded-md px-3 py-2 text-white/90 hover:bg-white/10"
            >
              Sair
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 flex flex-col gap-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-blue">
              Selecione a arena
            </h1>
            <p className="text-brand-blue font-medium">
              Reviva seus melhores momentos.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="h-32 w-32 grid place-items-center text-6xl text-brand-blue-dark">
              📹
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-xl flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3">
              <span aria-hidden>🔍</span>
              <input
                type="search"
                placeholder="Qual cidade você está buscando ?"
                className="flex-1 bg-transparent text-slate-600 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <section>
            <h2 className="text-lg font-bold text-brand-blue mb-3">
              Arenas favoritas
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ARENAS_FAVORITAS.map((arena) => (
                <li
                  key={arena.nome}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                >
                  <div className="relative h-28 bg-slate-200">
                    <span className="absolute top-2 right-2 rounded bg-white/90 px-2 py-0.5 text-xs font-semibold text-brand-blue-dark">
                      ★ {arena.nota}
                    </span>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="font-semibold text-slate-800">{arena.nome}</p>
                    <p className="text-xs text-slate-500">
                      📍 {arena.distancia} • {arena.cidade}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {arena.quadras} Courts
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {arena.extras}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  )
}
