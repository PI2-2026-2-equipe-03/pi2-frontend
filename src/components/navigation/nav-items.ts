import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Film,
  Home,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  User,
} from 'lucide-react'

import type { UserRole } from '@/lib/types'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
  // sem roles: visível para qualquer perfil
  roles?: readonly UserRole[]
}

// single source for the app area: the sidebar, the bottom nav and the profile
// hub all derive from this list, so a destination is declared exactly once
export const APP_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Início', to: '/app', icon: Home, end: true },
  { label: 'Replays', to: '/app/replays', icon: Film },
  { label: 'Arenas', to: '/app/arenas', icon: MapPin },
  { label: 'Quadras', to: '/app/quadras', icon: LayoutGrid },
  {
    label: 'Solicitar gestão',
    to: '/app/solicitar-gestor',
    icon: Briefcase,
    roles: ['USR'],
  },
  {
    label: 'Gestão',
    to: '/admin',
    icon: LayoutDashboard,
    roles: ['ADM', 'CLI'],
  },
]

// not part of APP_NAV_ITEMS because the sidebar keeps the profile in its
// footer, next to the logout button
const PROFILE_ITEM: NavItem = { label: 'Perfil', to: '/app/perfil', icon: User }

// d-01: four tabs at the bottom, because the ux ceiling is five
const TAB_ROUTES: readonly string[] = ['/app', '/app/replays', '/app/arenas']

export const APP_TAB_ITEMS: readonly NavItem[] = [
  ...APP_NAV_ITEMS.filter((item) => TAB_ROUTES.includes(item.to)),
  PROFILE_ITEM,
]

// derived, never hand-written: whatever the bottom nav leaves out surfaces in
// the profile screen, so adding an item above cannot orphan a route on mobile
export const APP_SECONDARY_ITEMS: readonly NavItem[] = APP_NAV_ITEMS.filter(
  (item) => !TAB_ROUTES.includes(item.to),
)

// one role filter for every consumer of the lists above
export function visibleNavItems(
  items: readonly NavItem[],
  role: UserRole | undefined,
): readonly NavItem[] {
  return items.filter(
    (item) => !item.roles || (role && item.roles.includes(role)),
  )
}
