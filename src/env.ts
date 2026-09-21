import { z } from 'zod'

// valida variáveis do vite no boot — evita boot silencioso com env quebrada
const envSchema = z
  .object({
    VITE_API_URL: z.url().optional(),
    VITE_APP_ENV: z.enum(['development', 'staging', 'production']).optional(),
  })
  .superRefine((data, ctx) => {
    const environment = data.VITE_APP_ENV ?? 'development'
    if (environment !== 'development' && !data.VITE_API_URL) {
      ctx.addIssue({
        code: 'custom',
        path: ['VITE_API_URL'],
        message:
          'VITE_API_URL é obrigatória em ambientes staging e production.',
      })
    }
  })

export const env = envSchema.parse(import.meta.env)
