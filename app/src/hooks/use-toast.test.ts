import { test } from 'node:test'
import assert from 'node:assert/strict'
import { reducer } from './use-toast'

const baseToast = { id: '1', open: true } as any

/** utility to deep clone object */
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

test('ADD_TOAST adds a toast', () => {
  const state = { toasts: [] as any[] }
  const result = reducer(state, { type: 'ADD_TOAST', toast: baseToast })
  assert.deepEqual(result.toasts, [baseToast])
})

test('UPDATE_TOAST updates existing toast', () => {
  const state = { toasts: [clone(baseToast)] }
  const result = reducer(state, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'new' } })
  assert.equal(result.toasts[0].title, 'new')
})


test('REMOVE_TOAST removes a toast', () => {
  const state = { toasts: [clone(baseToast), { id: '2' } as any] }
  const result = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' })
  assert.equal(result.toasts.length, 1)
  assert.equal(result.toasts[0].id, '2')
})
