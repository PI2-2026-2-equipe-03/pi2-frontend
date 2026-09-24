import { Check, X } from 'lucide-react'

import { cn } from '@/lib/utils'

type PasswordRequirementsProps = {
  password: string
  confirmPassword: string
}

type Requirement = {
  label: string
  isMet: boolean
}

// checklist visual da senha — feedback em tempo real enquanto o usuário digita
export function PasswordRequirements({
  password,
  confirmPassword,
}: PasswordRequirementsProps) {
  const requirements: Requirement[] = [
    {
      label: 'Pelo menos 8 dígitos',
      isMet: password.length >= 8,
    },
    {
      label: 'Possui letras, números e símbolos',
      isMet:
        /[a-zA-Z]/.test(password) &&
        /\d/.test(password) &&
        /[^a-zA-Z0-9]/.test(password),
    },
    {
      label: 'As senhas coincidem',
      isMet: password.length > 0 && password === confirmPassword,
    },
  ]

  return (
    <ul className="space-y-1">
      {requirements.map((requirement) => (
        <li
          key={requirement.label}
          className={cn(
            'flex items-center gap-2 text-xs',
            requirement.isMet ? 'text-success' : 'text-muted-foreground',
          )}
        >
          {requirement.isMet ? (
            <Check className="size-3.5" />
          ) : (
            <X className="size-3.5" />
          )}
          {requirement.label}
        </li>
      ))}
    </ul>
  )
}
