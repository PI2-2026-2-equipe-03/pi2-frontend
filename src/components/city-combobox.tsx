import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

function stripDiacritics(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

// o filtro padrão do cmdk é sensível a acento: "tucurui" não acharia "Tucuruí".
function matchCity(cityValue: string, search: string): number {
  return stripDiacritics(cityValue).includes(stripDiacritics(search.trim()))
    ? 1
    : 0
}

type CityComboboxProps = {
  value: string
  onValueChange: (value: string) => void
  cities: readonly string[]
  // valor sentinela de "sem filtro" — fica com o chamador pra não quebrar urls
  anyValue: string
  anyLabel?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
}

export function CityCombobox({
  value,
  onValueChange,
  cities,
  anyValue,
  anyLabel = 'Todas as cidades',
  placeholder = 'Cidade',
  searchPlaceholder = 'Buscar cidade…',
  emptyMessage = 'Nenhuma cidade encontrada.',
  className,
}: CityComboboxProps) {
  const [open, setOpen] = useState(false)
  const isAny = value === anyValue
  const label = isAny ? placeholder : value

  function select(next: string) {
    onValueChange(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            isAny && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-56 p-0"
      >
        {/* filtragem nativa do Command: a lista é local e pequena */}
        <Command filter={matchCity}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              <CommandItem value={anyLabel} onSelect={() => select(anyValue)}>
                <Check
                  className={cn('size-4', isAny ? 'opacity-100' : 'opacity-0')}
                  aria-hidden
                />
                {anyLabel}
              </CommandItem>
              {cities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={() => select(city)}
                >
                  <Check
                    className={cn(
                      'size-4',
                      value === city ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden
                  />
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
