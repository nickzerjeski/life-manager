import { beforeEach, test, expect } from 'vitest'
import { APP_CONFIG, loadWorkweekConfig, saveWorkweekConfig, type WorkweekConfig } from './appConfig'

beforeEach(() => {
  localStorage.clear()
  APP_CONFIG.workweek = { days: ['Mon', 'Tue'], start: '08:00', end: '17:00' }
})

test('loadWorkweekConfig populates APP_CONFIG from localStorage', () => {
  const config: WorkweekConfig = { days: ['Fri'], start: '09:00', end: '18:00' }
  localStorage.setItem('workweek', JSON.stringify(config))
  loadWorkweekConfig()
  expect(APP_CONFIG.workweek).toEqual(config)
})

test('saveWorkweekConfig stores config to localStorage', () => {
  const config: WorkweekConfig = { days: ['Wed'], start: '10:00', end: '15:00' }
  saveWorkweekConfig(config)
  expect(APP_CONFIG.workweek).toEqual(config)
  expect(JSON.parse(localStorage.getItem('workweek')!)).toEqual(config)
})
