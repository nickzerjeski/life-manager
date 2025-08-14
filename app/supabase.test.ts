import { describe, test, expect, beforeAll } from 'vitest'

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

    const tables = ['doc_emb', 'doc_metadata', 'doc_rows', 'goals', 'projects', 'tasks', 'topics']
    tables.forEach(table => {
      test(`table ${table} exists`, async () => {
        const { error } = await supabase.from(table).select('*').limit(1)
        expect(error).toBeNull()
      })
    })
  })
}
