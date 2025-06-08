import { test } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { createServer } from './server'

function request(method: string, path: string, body = ''): Promise<{ status: number; data: any }> {
  const server = createServer()
  return new Promise((resolve, reject) => {
    server.listen(0, () => {
      const { port } = server.address() as any
      const options = { method, port, path }
      const req = http.request(options, res => {
        let data = ''
        res.on('data', chunk => (data += chunk))
        res.on('end', () => {
          server.close()
          const text = data || 'null'
          resolve({ status: res.statusCode || 0, data: JSON.parse(text) })
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

test('GET /goals returns initial goals', async () => {
  const res = await request('GET', '/goals')
  assert.equal(res.status, 200)
  assert.ok(Array.isArray(res.data))
  assert.ok(res.data.length >= 1)
})

test('POST /goals creates a goal', async () => {
  const newGoal = { id: 99, name: 'new', description: '', start: 0, stand: 0, objective: 1, period: [new Date(), new Date()], status: 'Not Started', aol: 'Growth' }
  const res = await request('POST', '/goals', JSON.stringify(newGoal))
  assert.equal(res.status, 201)
  assert.equal(res.data.id, 99)
})

test('DELETE /goals removes a goal', async () => {
  const resCreate = await request('POST', '/goals', JSON.stringify({ id: 100, name: 'temp', description: '', start: 0, stand: 0, objective: 1, period: [new Date(), new Date()], status: 'Not Started', aol: 'Growth' }))
  assert.equal(resCreate.status, 201)
  const resDel = await request('DELETE', '/goals/100')
  assert.equal(resDel.status, 204)
})
