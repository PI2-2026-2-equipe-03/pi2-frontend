import { Eye, EyeOff, Lock } from 'lucide-react'
import { type ComponentProps, forwardRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// campo de senha com cadeado à esquerda e toggle de visibilidade à direita.
// recebe os props do react-hook-form via FormControl, então precisa repassar
// ref e props para o <input> interno.
export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<ComponentProps<typeof Input>, 'type'>
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Lock
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden
      />
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        className={cn('px-9', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  )
})
PasswordInput.displayName = 'PasswordInput'
