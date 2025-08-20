import { test, expect } from 'vitest'
import { manualTaskStyle, automationTaskStyle } from './taskStyles'

test('manualTaskStyle uses blue theme', () => {
  expect(manualTaskStyle).toBe('bg-blue-50 border border-blue-200')
})

test('automationTaskStyle defines classes for all states', () => {
  expect(automationTaskStyle.running).toBe('bg-green-50 border border-green-200 animate-pulse')
  expect(automationTaskStyle.attention).toBe('bg-orange-50 border border-orange-200')
  expect(automationTaskStyle.not_started).toBe('bg-gray-50 border border-gray-200')
  expect(automationTaskStyle.failed).toBe('bg-red-50 border border-red-200')
})
