/* eslint-disable react-refresh/only-export-components */
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { AppLayout } from '@/pages/_layouts/app'
import { AuthLayout } from '@/pages/_layouts/auth'
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
      { path: '*', element: <Navigate to="/sign-in" replace /> },
    ],
  },
])
