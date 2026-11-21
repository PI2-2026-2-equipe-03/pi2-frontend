// one barrel per area: every lazy() in routes.tsx goes through this module, so
// rollup emits one chunk per area instead of one per screen.
export { AdminLayout } from '@/pages/_layouts/admin'
export { Dashboard } from '@/pages/admin/dashboard'
export { AdminPatrocinadores } from '@/pages/admin/patrocinadores'
export { AdminQuadras } from '@/pages/admin/quadras'
