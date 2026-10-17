import { Check, X } from 'lucide-react'

import { evaluatePassword } from '@/lib/forms/password-rules'
import { cn } from '@/lib/utils'

type PasswordRequirementsProps = {
  password: string
  confirmPassword: string
}

// checklist visual da senha — feedback em tempo real enquanto o usuário digita.
// delega os critérios ao helper em @/lib/forms/password-rules.
export function PasswordRequirements({
  password,
  confirmPassword,
}: PasswordRequirementsProps) {
  const rules = evaluatePassword(password, confirmPassword)

  return (
    <ul className="space-y-1">
      {rules.map((rule) => (
        <li
          key={rule.key}
          className={cn(
            'flex items-center gap-2 text-xs transition-colors duration-150',
            rule.isMet ? 'text-success' : 'text-muted-foreground',
          )}
        >
          {rule.isMet ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <X className="size-3.5" aria-hidden />
          )}
          <span>{rule.label}</span>
        </li>
      ))}
    </ul>
  )
}
