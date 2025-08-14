import { test, expect } from 'vitest'
import { cn } from './utils'

test('cn merges class names using tailwind-merge', () => {
  expect(cn('p-2', 'p-4')).toBe('p-4')
})

test('cn skips falsey values', () => {
  expect(cn('a', undefined, 'b')).toBe('a b')
})
