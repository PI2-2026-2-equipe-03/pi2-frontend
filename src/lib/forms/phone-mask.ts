// máscara brasileira pro campo de telefone.
// aceita até 11 dígitos (celular). o valor armazenado no form fica formatado;
// o schema zod aceita parens/hífen/espaço como validadores soltos.

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  if (digits.length <= 10) {
    // fixo: (DD) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  // celular: (DD) XXXXX-XXXX
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}
