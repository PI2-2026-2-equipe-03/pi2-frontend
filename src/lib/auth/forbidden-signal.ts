// liga o interceptor do axios, que está fora do react, ao modal global de 403
let open = false
const listeners = new Set<() => void>()

function setOpen(next: boolean) {
  open = next
  listeners.forEach((listener) => listener())
}

export function showForbidden(): void {
  setOpen(true)
}

export function hideForbidden(): void {
  setOpen(false)
}

export function isForbiddenOpen(): boolean {
  return open
}

export function subscribeForbidden(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
