// one barrel per area: every lazy() in routes.tsx goes through this module, so
// rollup emits one chunk per area instead of one per screen.
export { AuthLayout } from '@/pages/_layouts/auth'
export { ForgotPassword } from '@/pages/auth/forgot-password'
export { ResetPassword } from '@/pages/auth/reset-password'
export { SignIn } from '@/pages/auth/sign-in'
export { SignUp } from '@/pages/auth/sign-up'
