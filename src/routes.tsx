/* eslint-disable react-refresh/only-export-components */
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { AdminLayout } from '@/pages/_layouts/admin'
import { AppLayout } from '@/pages/_layouts/app'
import { AuthLayout } from '@/pages/_layouts/auth'
import { Dashboard } from '@/pages/admin/dashboard'
import { Home } from '@/pages/app/home'
import { ForgotPassword } from '@/pages/auth/forgot-password'
import { ResetPassword } from '@/pages/auth/reset-password'
import { Arenas } from '@/pages/app/arenas'
import { Home } from '@/pages/app/home'
import { Quadras } from '@/pages/app/quadras'
import { Replays } from '@/pages/app/replays'
import { SignIn } from '@/pages/auth/sign-in'
import { SignUp } from '@/pages/auth/sign-up'

// adapter do nuqs para que query params sejam gerenciados em todas as rotas
function NuqsRouteWrapper() {
  return (
    <NuqsAdapter>
      <Outlet />
    </NuqsAdapter>
  )
}

export const router = createBrowserRouter([
  {
    element: <NuqsRouteWrapper />,
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
          { path: 'arenas', element: <Arenas /> },
          { path: 'quadras', element: <Quadras /> },
        ],
      },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [{ index: true, element: <Dashboard /> }],
      },
      { path: '*', element: <Navigate to="/sign-in" replace /> },
    ],
  },
])
