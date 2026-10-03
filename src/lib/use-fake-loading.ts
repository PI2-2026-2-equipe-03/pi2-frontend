import { useEffect, useState } from 'react'

// simula um delay de carregamento pra permitir que skeletons apareçam enquanto
// o backend não está integrado. em produção isso será substituído pelo
// `isPending` do TanStack Query. threshold padrão: 420ms — acima do limite de
// flash (<300ms perceivable) recomendado pelas UX guidelines (ui-ux-pro-max).
export function useFakeLoading(ms: number = 420): boolean {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), ms)
    return () => window.clearTimeout(id)
  }, [ms])

  return loading
}
