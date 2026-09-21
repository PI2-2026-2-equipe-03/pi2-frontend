import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// combina classes tailwind com merge de conflitos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
