import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Login } from './Login'
import { Inicio } from './Inicio'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  { path: '/inicio', element: <Inicio /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
