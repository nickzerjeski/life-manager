import http from 'node:http'

/**
 * Entry point for the HTTP API server. This file wires together all route
 * handlers and exposes a `createServer` helper used both in production and in
 * tests.
 */
import { initData } from './data/data'
import { handleGoalRequests } from './routes/goals'
import { handleProjectRequests } from './routes/projects'
import { handleDocumentRequests } from './routes/documents'
import { handleTaskRequests } from './routes/tasks'
import { handleTopicRequests } from './routes/topics'
import { handleChatRequests } from './routes/chats'

initData()

/**
 * Creates and returns an HTTP server instance with all API routes attached.
 * The server is CORS enabled and designed to be used both during development
 * and inside the automated test suite.
 */
export function createServer() {
  return http.createServer(async (req, res) => {
    const { method, url } = req

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    const parsed = new URL(url || '/', 'http://localhost')

    if (await handleGoalRequests(req, res, parsed)) return
    if (await handleProjectRequests(req, res, parsed)) return
    if (await handleDocumentRequests(req, res, parsed)) return
    if (await handleTaskRequests(req, res, parsed)) return
    if (await handleTopicRequests(req, res, parsed)) return
    if (await handleChatRequests(req, res, parsed)) return

    res.statusCode = 404
    res.end('Not Found')
  })
}

if (require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3001
  createServer().listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Server running on http://localhost:${port}`)
  })
}
