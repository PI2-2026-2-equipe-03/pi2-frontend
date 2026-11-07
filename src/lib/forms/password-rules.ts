import { passwordComplexityRegex } from '@/lib/schemas/password'

// critérios de senha compartilhados entre schema e UI
export type PasswordRuleKey = 'length' | 'complexity' | 'match'

export type PasswordRule = {
  key: PasswordRuleKey
  label: string
  isMet: boolean
}

export function evaluatePassword(
  password: string,
  confirmPassword: string,
): PasswordRule[] {
  return [
    {
      key: 'length',
      label: 'Pelo menos 8 dígitos',
      isMet: password.length >= 8,
    },
    {
      key: 'complexity',
      label: 'Possui letras, números e símbolos',
      isMet: passwordComplexityRegex.test(password),
    },
    {
      key: 'match',
      label: 'As senhas coincidem',
      isMet: password.length > 0 && password === confirmPassword,
    },
  ]
}
