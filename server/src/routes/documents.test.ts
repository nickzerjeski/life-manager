import { test } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { supabase } from '../supabaseClient'
import { setSupabaseClient, setSendRequest } from './documents'

async function request(method: string, path: string, body = ''): Promise<{ status: number; data: any }> {
  const { createServer } = await import('../server')
  const server = createServer()
  return new Promise((resolve, reject) => {
    server.listen(0, () => {
      const { port } = server.address() as any
      const options = { method, port, path, headers: { 'Content-Type': 'application/json' } }
      const req = http.request(options, res => {
        let data = ''
        res.on('data', chunk => (data += chunk))
        res.on('end', () => {
          server.close()
          let parsed: any = data || null
          try {
            if (data) parsed = JSON.parse(data)
          } catch {
            parsed = data
          }
          resolve({ status: res.statusCode || 0, data: parsed })
        })
      })
      req.on('error', err => {
        server.close()
        reject(err)
      })
      if (body) {
        req.write(body)
      }
      req.end()
    })
  })
}

test('upload endpoint stores file in Supabase', async () => {
  process.env.SKIP_WEBHOOK = '1'
  const originalStorage = (supabase as any).storage
  let receivedPath = ''
  let uploadedBuffer: Buffer | null = null
  let created = false
  const stub = {
    storage: {
      listBuckets: async () => ({ data: [], error: null }),
      createBucket: async () => { created = true; return { data: null, error: null } },
      from: (_bucket: string) => ({
        upload: async (path: string, buffer: Buffer) => {
          receivedPath = path
          uploadedBuffer = buffer
          return { data: null, error: null }
        },
        getPublicUrl: (path: string) => ({ data: { publicUrl: `http://example.com/${path}` } })
      })
    }
  } as any
  setSupabaseClient(stub)
  setSendRequest(async () => {})

  const doc = { id: 101, goalId: 1, projectId: 1, name: 'doc.txt', type: 'txt', uploadDate: new Date().toISOString() }
  const resCreate = await request('POST', '/documents', JSON.stringify(doc))
  assert.equal(resCreate.status, 201)

  const file = { name: 'hello.txt', content: Buffer.from('hello').toString('base64'), mimeType: 'text/plain' }
  const resUpload = await request('POST', `/documents/${doc.id}/upload`, JSON.stringify(file))
  assert.equal(resUpload.status, 201)
  assert.equal(receivedPath, `goal-${doc.goalId}/project-${doc.projectId}/${file.name}`)
  assert.ok(uploadedBuffer instanceof Buffer)
  setSupabaseClient(supabase as any)
  ;(supabase as any).storage = originalStorage
})
