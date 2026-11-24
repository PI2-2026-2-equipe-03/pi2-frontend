import { useTheme } from 'next-themes'
import type * as React from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import {
  IconeAviso,
  IconeErro,
  IconeInfo,
  IconeSucesso,
} from '@/components/repeteco-icons'
import { RepetecoLoader } from '@/components/repeteco-loader'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  // loader maior no desktop: em 16px (size-4) o "e" animado vira círculo;
  // 20px (size-5) mantém o traço legível sem pesar no toast
  const loaderClass = 'size-4 md:size-5'

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      // ícones da marca; o loader fica sem rótulo porque o próprio toast já é anunciado
      icons={{
        success: <IconeSucesso className="size-4" />,
        info: <IconeInfo className="size-4" />,
        warning: <IconeAviso className="size-4" />,
        error: <IconeErro className="size-4" />,
        loading: <RepetecoLoader className={loaderClass} label="" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
