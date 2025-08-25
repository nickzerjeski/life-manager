import { expect, test, vi } from 'vitest'
import { signInWithGoogle, saveWorkweek } from './SettingPage'
import supabase from '../../supabase'
import { saveWorkweekConfig } from '@/utils/appConfig'

vi.mock('../../supabase', () => ({
  default: {
    auth: {
      signInWithOAuth: vi.fn(),
    },
  },
}))

vi.mock('@/utils/appConfig', () => ({
  APP_CONFIG: {},
  loadWorkweekConfig: vi.fn(),
  saveWorkweekConfig: vi.fn(),
}))

test('signInWithGoogle triggers Supabase OAuth', async () => {
  await signInWithGoogle()
  expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
    provider: 'google',
    options: { scopes: 'https://www.googleapis.com/auth/calendar' },
  })
})

test('saveWorkweek calls saveWorkweekConfig with provided values', () => {
  const cfg = { days: ['Mon'], start: '08:00', end: '17:00' }
  saveWorkweek(cfg)
  expect(saveWorkweekConfig).toHaveBeenCalledWith(cfg)
})
