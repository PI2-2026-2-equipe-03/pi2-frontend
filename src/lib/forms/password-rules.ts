import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  passwordLowercaseRegex,
  passwordNumberRegex,
  passwordSpecialRegex,
  passwordUppercaseRegex,
} from '@/lib/schemas/password'

// critérios de senha compartilhados entre schema e UI
export type PasswordRuleKey =
  'length' | 'uppercase' | 'lowercase' | 'number' | 'special' | 'match'

export type PasswordRule = {
  key: PasswordRuleKey
  label: string
  isMet: boolean
}

// one line per server rule: grouping them hid which criterion was missing
export function evaluatePassword(
  password: string,
  confirmPassword: string,
): PasswordRule[] {
  return [
    {
      key: 'length',
      label: `Entre ${PASSWORD_MIN_LENGTH} e ${PASSWORD_MAX_LENGTH} caracteres`,
      isMet:
        password.length >= PASSWORD_MIN_LENGTH &&
        password.length <= PASSWORD_MAX_LENGTH,
    },
    {
      key: 'uppercase',
      label: 'Uma letra maiúscula',
      isMet: passwordUppercaseRegex.test(password),
    },
    {
      key: 'lowercase',
      label: 'Uma letra minúscula',
      isMet: passwordLowercaseRegex.test(password),
    },
    {
      key: 'number',
      label: 'Um número',
      isMet: passwordNumberRegex.test(password),
    },
    {
      key: 'special',
      label: 'Um símbolo (o espaço não conta)',
      isMet: passwordSpecialRegex.test(password),
    },
    {
      key: 'match',
      label: 'As senhas coincidem',
      isMet: password.length > 0 && password === confirmPassword,
    },
  ]
}
