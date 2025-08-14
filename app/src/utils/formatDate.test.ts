import { test, expect } from 'vitest'
import { formatDate } from './formatDate'

test('formatDate returns dd.mm.yyyy in de-DE locale', () => {
  const date = new Date('2024-12-11')
  expect(formatDate(date)).toBe('11.12.2024')
})
