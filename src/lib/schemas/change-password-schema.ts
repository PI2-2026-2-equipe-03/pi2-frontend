import { z } from 'zod'

import { passwordComplexityRegex } from '@/lib/schemas/password'

// change-password form (current + new + confirmation). same policy as sign-up
// and reset: the complexity rule lives in one place only.
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe sua senha atual'),
    newPassword: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 dígitos')
      .regex(
        passwordComplexityRegex,
        'A senha deve ter letras, números e símbolos',
      ),
    confirmPassword: z.string().min(1, 'Confirme sua nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  // the server refuses the previous password too; checking here saves a round
  // trip for an error the user can already see
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'A nova senha deve ser diferente da atual',
    path: ['newPassword'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
