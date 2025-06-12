import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cn } from './utils'

test('cn merges class names using tailwind-merge', () => {
  assert.equal(cn('p-2', 'p-4'), 'p-4')
})

test('cn skips falsey values', () => {
  assert.equal(cn('a', undefined, 'b'), 'a b')
})
