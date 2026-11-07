import { describe, expect, test } from 'vitest'

import { formatCep, formatCnpj, formatCpf } from '@/lib/forms/document-masks'

describe('formatCpf', () => {
  test('formats complete CPF', () => {
    expect(formatCpf('12345678901')).toBe('123.456.789-01')
  })

  test('returns partial input as-is', () => {
    expect(formatCpf('123')).toBe('123')
  })

  test('returns empty for empty', () => {
    expect(formatCpf('')).toBe('')
  })
})

describe('formatCnpj', () => {
  test('formats complete CNPJ', () => {
    expect(formatCnpj('12345678000195')).toBe('12.345.678/0001-95')
  })

  test('returns partial input as-is', () => {
    expect(formatCnpj('12')).toBe('12')
  })
})

describe('formatCep', () => {
  test('formats complete CEP', () => {
    expect(formatCep('12345678')).toBe('12345-678')
  })

  test('returns partial input as-is', () => {
    expect(formatCep('123')).toBe('123')
  })
})
