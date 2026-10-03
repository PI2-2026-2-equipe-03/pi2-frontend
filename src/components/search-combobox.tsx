import { Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Suggestion } from '@/lib/search'

type SearchComboboxProps = {
  value: string
  onValueChange: (value: string) => void
  onSelect?: (suggestion: Suggestion) => void
  fetchSuggestions: (query: string) => Promise<Suggestion[]>
  placeholder?: string
  emptyMessage?: string
  debounceMs?: number
  size?: 'default' | 'hero'
  className?: string
}

export function SearchCombobox({
  value,
  onValueChange,
  onSelect,
  fetchSuggestions,
  placeholder = 'Buscar…',
  emptyMessage = 'Nenhum resultado.',
  debounceMs = 200,
  size = 'default',
  className,
}: SearchComboboxProps) {
  const listboxId = useId()
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    const timer = window.setTimeout(() => {
      fetchSuggestions(value)
        .then((items) => {
          if (!cancelled) setSuggestions(items)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, debounceMs)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [value, debounceMs, fetchSuggestions])

  const containerClasses =
    size === 'hero'
      ? 'rounded-full px-5 py-3 text-base shadow-md focus-within:shadow-lg'
      : 'rounded-full px-4 py-2 text-sm shadow-sm focus-within:shadow-md'

  return (
    <Popover open={open && Boolean(value.trim())} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          ref={containerRef}
          className={cn(
            'border-border bg-background focus-within:ring-tg-brand-blue/30 flex w-full items-center gap-2 border transition-all focus-within:ring-4',
            containerClasses,
            className,
          )}
        >
          <Search
            className={cn(
              'text-muted-foreground shrink-0',
              size === 'hero' ? 'size-5' : 'size-4',
            )}
            aria-hidden
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(event) => {
              onValueChange(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            className="w-full flex-1 border-0 bg-transparent outline-none placeholder:text-muted-foreground"
          />
          {value ? (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => {
                onValueChange('')
                setOpen(false)
                inputRef.current?.focus()
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className={size === 'hero' ? 'size-5' : 'size-4'} />
            </button>
          ) : null}
        </div>
      </PopoverAnchor>

      <PopoverContent
        id={listboxId}
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command shouldFilter={false}>
          <CommandList>
            {loading ? (
              <div className="text-muted-foreground px-3 py-6 text-center text-sm">
                Buscando…
              </div>
            ) : suggestions.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    value={suggestion.id}
                    onSelect={() => {
                      onSelect?.(suggestion)
                      onValueChange(suggestion.label)
                      setOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{suggestion.label}</span>
                      {suggestion.subtitle ? (
                        <span className="text-muted-foreground text-xs">
                          {suggestion.subtitle}
                        </span>
                      ) : null}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
