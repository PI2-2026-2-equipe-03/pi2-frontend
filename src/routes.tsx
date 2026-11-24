/* eslint-disable react-refresh/only-export-components */
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { type ComponentType, lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { RouteErrorElement } from '@/components/route-error-element'
import { RouteFallback } from '@/components/route-fallback'
import type { RouteHandle } from '@/pages/_layouts/app'

// one dynamic import per area. every lazy() below reuses the same loader, so
// rollup emits one chunk per area instead of one per screen.
const authArea = () => import('@/pages/auth-area')
const appArea = () => import('@/pages/app-area')
const adminArea = () => import('@/pages/admin-area')

// the role gate pulls the api layer and the auth client with it: keeping it
// lazy leaves both out of the entry chunk, which /sign-in never needs.
const roleGate = () => import('@/components/require-role')

// lazy() wants a default export; the areas use named exports, so pick by name
function lazyFrom<M extends Record<string, ComponentType>>(
  loadArea: () => Promise<M>,
  name: keyof M & string,
) {
  return lazy(() => loadArea().then((area) => ({ default: area[name] })))
}

const AuthLayout = lazyFrom(authArea, 'AuthLayout')
const SignIn = lazyFrom(authArea, 'SignIn')
const SignUp = lazyFrom(authArea, 'SignUp')
const ForgotPassword = lazyFrom(authArea, 'ForgotPassword')
const ResetPassword = lazyFrom(authArea, 'ResetPassword')

const AppLayout = lazyFrom(appArea, 'AppLayout')
const Home = lazyFrom(appArea, 'Home')
const Replays = lazyFrom(appArea, 'Replays')
const ReplayDetail = lazyFrom(appArea, 'ReplayDetail')
const Arenas = lazyFrom(appArea, 'Arenas')
const Quadras = lazyFrom(appArea, 'Quadras')
const Perfil = lazyFrom(appArea, 'Perfil')
const SolicitarGestor = lazyFrom(appArea, 'SolicitarGestor')

const AdminLayout = lazyFrom(adminArea, 'AdminLayout')
const Dashboard = lazyFrom(adminArea, 'Dashboard')
const AdminQuadras = lazyFrom(adminArea, 'AdminQuadras')
const AdminPatrocinadores = lazyFrom(adminArea, 'AdminPatrocinadores')

// not via lazyFrom: RequireRole takes props, the helper only types screens
const RequireRole = lazy(() =>
  roleGate().then((gate) => ({ default: gate.RequireRole })),
)

// not via lazyFrom either: NotFound takes props, and it is the only screen that
// lives outside the three areas
const NotFound = lazy(() =>
  import('@/pages/not-found').then((page) => ({ default: page.NotFound })),
)

// adapter do nuqs para que query params sejam gerenciados em todas as rotas
function NuqsRouteWrapper() {
  return (
    <NuqsAdapter>
      {/* the area chunk lands after the shell: a fallback avoids a blank page */}
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </NuqsAdapter>
  )
}

export const router = createBrowserRouter([
  {
    element: <NuqsRouteWrapper />,
    errorElement: <RouteErrorElement />,
    children: [
      { path: '/', element: <Navigate to="/sign-in" replace /> },
      {
        element: <AuthLayout />,
        children: [
          { path: '/sign-in', element: <SignIn /> },
          { path: '/sign-up', element: <SignUp /> },
          { path: '/forgot-password', element: <ForgotPassword /> },
          { path: '/reset-password', element: <ResetPassword /> },
        ],
      },
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'replays', element: <Replays /> },
          { path: 'replays/:id', element: <ReplayDetail /> },
          { path: 'arenas', element: <Arenas /> },
          { path: 'quadras', element: <Quadras /> },
          { path: 'perfil', element: <Perfil /> },
          {
            // the bar only exists once the form (or its success state) renders:
            // RequireRole's denied/error/loading states have neither nav nor
            // bar. accepted, they are transient and have their own exits
            path: 'solicitar-gestor',
            handle: { hideBottomNav: true } satisfies RouteHandle,
            element: (
              <RequireRole roles={['USR']}>
                <SolicitarGestor />
              </RequireRole>
            ),
          },
        ],
      },
      {
        path: '/admin',
        element: (
          <RequireRole roles={['ADM', 'CLI']}>
            <AdminLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'quadras', element: <AdminQuadras /> },
          { path: 'patrocinadores', element: <AdminPatrocinadores /> },
          // own catch-all: the error shows up inside the layout, so the admin
          // keeps the menu and the header
          { path: '*', element: <NotFound embedded /> },
        ],
      },
      // unknown route used to bounce to /sign-in, which looked like a dropped
      // session to anyone already signed in
      { path: '*', element: <NotFound /> },
    ],
  },
])
