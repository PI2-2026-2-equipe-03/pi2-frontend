import { z } from 'zod'

import { passwordComplexityRegex } from '@/lib/schemas/password'

// schema do formulário de criação de conta (rf/sprint 2 vai integrar com o backend)
export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Informe seu nome completo'),
    email: z.email('E-mail inválido'),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9()+\-\s]{8,20}$/, 'Telefone inválido'),
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

export type SignUpInput = z.infer<typeof signUpSchema>
