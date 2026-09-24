import { z } from 'zod'

// schema do formulário de recuperação de senha
export const forgotPasswordSchema = z.object({
  email: z.email('E-mail inválido'),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
