import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// the custom --spacing-* tokens from style.css: without them twMerge keeps
// both h-touch-min and a consumer's h-auto, and css order picks the winner
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'touch-min',
        'touch-comfortable',
        'safe-top',
        'safe-bottom',
        'header',
      ],
    },
  },
})

// combina classes tailwind com merge de conflitos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
