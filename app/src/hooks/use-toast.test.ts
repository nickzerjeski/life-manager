import { test, expect } from 'vitest'
import { reducer } from './use-toast'

const baseToast = { id: '1', open: true } as any

/** utility to deep clone object */
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

test('ADD_TOAST adds a toast', () => {
  const state = { toasts: [] as any[] }
  const result = reducer(state, { type: 'ADD_TOAST', toast: baseToast })
  expect(result.toasts).toEqual([baseToast])
})

test('UPDATE_TOAST updates existing toast', () => {
  const state = { toasts: [clone(baseToast)] }
  const result = reducer(state, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'new' } })
  expect(result.toasts[0].title).toBe('new')
})

test('REMOVE_TOAST removes a toast', () => {
  const state = { toasts: [clone(baseToast), { id: '2' } as any] }
  const result = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' })
  expect(result.toasts).toHaveLength(1)
  expect(result.toasts[0].id).toBe('2')
})
