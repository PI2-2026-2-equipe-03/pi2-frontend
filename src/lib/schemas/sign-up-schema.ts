import { z } from 'zod'

// schema de cadastro — validação client-side (sprint 2 integra com o backend)
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Informe seu nome completo')
      .max(80, 'Nome muito longo'),
    email: z.email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string(),
    phone: z
      .string()
      .regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  })

export type SignUpInput = z.infer<typeof signUpSchema>
