import { describe, test, expect, beforeAll, vi, afterEach } from 'vitest'

describe('supabase configuration', () => {
  const originalEnv = { ...import.meta.env } as Record<string, string | undefined>

  afterEach(() => {
    vi.resetModules()
    const env = import.meta.env as Record<string, string | undefined>
    env.VITE_SUPABASE_URL = originalEnv.VITE_SUPABASE_URL
    env.VITE_SUPABASE_ANON_KEY = originalEnv.VITE_SUPABASE_ANON_KEY
  })

  test('throws when environment variables are missing', async () => {
    const env = import.meta.env as Record<string, string | undefined>
    delete env.VITE_SUPABASE_URL
    delete env.VITE_SUPABASE_ANON_KEY

    await expect(import('./supabase')).rejects.toThrow(
      /VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY/,
    )
  })

  test('creates client when environment variables are present', async () => {
    const env = import.meta.env as Record<string, string | undefined>
    env.VITE_SUPABASE_URL = 'https://example.supabase.co'
    env.VITE_SUPABASE_ANON_KEY = 'anon-key'

    const mod = await import('./supabase')
    expect(mod.default).toBeDefined()
  })
})

const requiredEnv = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
const missing = requiredEnv.filter(k => !import.meta.env[k as keyof ImportMetaEnv])

if (missing.length) {
  describe.skip('supabase backend', () => {
    test('skipped: missing environment configuration', () => {})
  })
} else {
  describe('supabase backend', () => {
    let supabase: any

    beforeAll(async () => {
      supabase = (await import('./supabase')).default
    })

    test('connects successfully', async () => {
      const { error } = await supabase.auth.getSession()
      expect(error).toBeNull()
    })

    const tables = ['documents', 'document_metadata', 'document_rows', 'goals', 'projects', 'tasks', 'topics']
    tables.forEach(table => {
      test(`table ${table} exists`, async () => {
        const { error } = await supabase.from(table).select('*').limit(1)
        expect(error).toBeNull()
      })
    })
  })
}
