import { z } from 'zod'

// the server is the authority: `strongPassword` in pi2-backend
// src/http/errors.ts. a looser rule here paints the checklist green for a
// password the server then refuses, with nothing on screen to explain why.
export const PASSWORD_MIN_LENGTH = 8
// bcrypt ignores whatever comes after 72 bytes, so the server caps it there
export const PASSWORD_MAX_LENGTH = 72

// one regex per criterion, so the checklist can point at the rule that failed
export const passwordUppercaseRegex = /[A-Z]/
export const passwordLowercaseRegex = /[a-z]/
export const passwordNumberRegex = /[0-9]/
// \s stays out of the class: the server does not take space as a symbol
export const passwordSpecialRegex = /[^A-Za-z0-9\s]/

// single source of truth for the policy: every new-password field reuses it
export const passwordField = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`,
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `A senha deve ter no máximo ${PASSWORD_MAX_LENGTH} caracteres`,
  )
  .regex(passwordUppercaseRegex, 'A senha deve ter uma letra maiúscula')
  .regex(passwordLowercaseRegex, 'A senha deve ter uma letra minúscula')
  .regex(passwordNumberRegex, 'A senha deve ter um número')
  .regex(passwordSpecialRegex, 'A senha deve ter um símbolo, sem contar espaço')
