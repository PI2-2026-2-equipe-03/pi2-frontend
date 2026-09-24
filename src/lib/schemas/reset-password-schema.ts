import { z } from 'zod'

import { passwordComplexityRegex } from '@/lib/schemas/password'

// schema do formulário de redefinição de senha (nova senha + confirmação)
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 dígitos')
      .regex(
        passwordComplexityRegex,
        'A senha deve ter letras, números e símbolos',
      ),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
