import { z } from 'zod'

import type { ManagerRequestBody } from '@/lib/api/manager-requests'

function digitsOf(value: string): string {
  return value.replace(/\D/g, '')
}

// limites iguais aos do backend: o que passa aqui não volta como 400
export const managerRequestSchema = z.object({
  cpf: z
    .string()
    .refine(
      (value) => digitsOf(value).length === 11,
      'Informe os 11 dígitos do CPF',
    ),
  cnpj: z
    .string()
    .refine(
      (value) => value === '' || digitsOf(value).length === 14,
      'Informe os 14 dígitos do CNPJ',
    ),
  companyName: z
    .string()
    .trim()
    .min(2, 'Informe a razão social')
    .max(150, 'Use no máximo 150 caracteres'),
  courtQuantity: z
    .string()
    .refine(
      (value) =>
        /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 1000,
      'Informe um número de 1 a 1000',
    ),
  street: z
    .string()
    .trim()
    .min(2, 'Informe a rua')
    .max(150, 'Use no máximo 150 caracteres'),
  neighborhood: z
    .string()
    .trim()
    .min(2, 'Informe o bairro')
    .max(100, 'Use no máximo 100 caracteres'),
  zipCode: z
    .string()
    .refine(
      (value) => digitsOf(value).length === 8,
      'Informe os 8 dígitos do CEP',
    ),
  city: z
    .string()
    .trim()
    .min(2, 'Informe a cidade')
    .max(100, 'Use no máximo 100 caracteres'),
  state: z.string().regex(/^[A-Za-z]{2}$/, 'Informe a sigla do estado'),
})

export type ManagerRequestInput = z.infer<typeof managerRequestSchema>

export function toManagerRequestBody(
  input: ManagerRequestInput,
): ManagerRequestBody {
  return {
    cpf: digitsOf(input.cpf),
    // o backend rejeita cnpj vazio: sem cnpj, o campo não vai no corpo
    ...(input.cnpj ? { cnpj: digitsOf(input.cnpj) } : {}),
    companyName: input.companyName,
    courtQuantity: Number(input.courtQuantity),
    address: {
      street: input.street,
      neighborhood: input.neighborhood,
      zipCode: digitsOf(input.zipCode),
      city: input.city,
      state: input.state.toUpperCase(),
    },
  }
}
