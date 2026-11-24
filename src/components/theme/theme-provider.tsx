import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type * as React from 'react'

// wrapper do next-themes com defaults do repeteco
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="repeteco-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
