import { z } from 'zod'

// schema do formulário de login (rf/sprint 2 vai integrar com o backend)
export const signInSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type SignInInput = z.infer<typeof signInSchema>
