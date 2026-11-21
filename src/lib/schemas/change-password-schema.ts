import { z } from 'zod'

import { passwordComplexityRegex } from '@/lib/schemas/password'

// mesma política do cadastro e da redefinição, mais a senha atual que a rota de
// troca exige. a validação aqui é conveniência: a palavra final é do servidor.
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
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'A nova senha deve ser diferente da atual',
    path: ['newPassword'],
  })

export type ChangePasswordFormInput = z.infer<typeof changePasswordSchema>
