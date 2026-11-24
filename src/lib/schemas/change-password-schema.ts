import { z } from 'zod'

import { passwordField } from '@/lib/schemas/password'

// change-password form (current + new + confirmation). the policy itself lives
// in passwordField, shared with sign-up and reset, so the three stay aligned
// with what the server enforces.
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe sua senha atual'),
    newPassword: passwordField,
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
