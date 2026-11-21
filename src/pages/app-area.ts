// one barrel per area: every lazy() in routes.tsx goes through this module, so
// rollup emits one chunk per area instead of one per screen.
export { AppLayout } from '@/pages/_layouts/app'
export { Arenas } from '@/pages/app/arenas'
export { Home } from '@/pages/app/home'
export { Perfil } from '@/pages/app/perfil'
export { Quadras } from '@/pages/app/quadras'
export { ReplayDetail } from '@/pages/app/replay-detail'
export { Replays } from '@/pages/app/replays'
export { SolicitarGestor } from '@/pages/app/solicitar-gestor'
