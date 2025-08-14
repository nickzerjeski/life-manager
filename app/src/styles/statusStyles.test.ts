import { test, expect } from 'vitest'
import { containerStyle, statusLabelStyle } from './statusStyles'
import { Status } from '@/models/Status'

test('containerStyle defines classes for all statuses', () => {
  expect(containerStyle[Status.ON_TRACK]).toBe('bg-green-50 border border-green-200')
  expect(containerStyle[Status.AT_RISK]).toBe('bg-yellow-50 border border-yellow-200')
  expect(containerStyle[Status.OFF_TRACK]).toBe('bg-red-50 border border-red-200')
  expect(containerStyle[Status.NOT_STARTED]).toBe('bg-gray-50 border border-gray-200')
  expect(containerStyle[Status.ACHIEVED]).toBe('bg-blue-50 border border-blue-200')
})

test('statusLabelStyle defines text colors for statuses', () => {
  expect(statusLabelStyle[Status.ON_TRACK]).toBe('bg-green-200 text-green-800')
  expect(statusLabelStyle[Status.AT_RISK]).toBe('bg-yellow-200 text-yellow-800')
  expect(statusLabelStyle[Status.OFF_TRACK]).toBe('bg-red-200 text-red-800')
  expect(statusLabelStyle[Status.NOT_STARTED]).toBe('bg-gray-200 text-gray-800')
  expect(statusLabelStyle[Status.ACHIEVED]).toBe('bg-blue-200 text-blue-800')
})
