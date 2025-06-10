import http from 'node:http'
import { parseBody } from '../utils'
import { data } from '../../data/data'

export async function handleDocumentRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  parsed: URL
): Promise<boolean> {
  const { method } = req

  if (method === 'GET' && parsed.pathname === '/documents') {
    const goalId = parsed.searchParams.get('goalId')
    const result = goalId
      ? data.documents.filter(d => d.goalId === Number(goalId))
      : data.documents
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result))
    return true
  }

  if (
    method === 'GET' &&
    parsed.pathname.startsWith('/documents/') &&
    !parsed.pathname.endsWith('/upload')
  ) {
    const id = Number(parsed.pathname.split('/')[2])
    const doc = data.documents.find(d => d.id === id)
    if (!doc) {
      res.statusCode = 404
      res.end('Not Found')
      return true
    }
    const file = data.documentFiles[id]
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        id: doc.id,
        goalId: doc.goalId,
        name: doc.name,
        type: doc.type,
        uploadDate: doc.uploadDate,
        content: file?.content || null,
      })
    )
    return true
  }

  if (method === 'POST' && parsed.pathname === '/documents') {
    const body = await parseBody(req)
    const doc = JSON.parse(body)
    const nextId = data.documents.length
      ? Math.max(...data.documents.map(d => d.id)) + 1
      : 1
    doc.id = doc.id || nextId
    data.documents.push(doc)
    res.statusCode = 201
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(doc))
    return true
  }

  if (
    method === 'POST' &&
    parsed.pathname.startsWith('/documents/') &&
    parsed.pathname.endsWith('/upload')
  ) {
    const parts = parsed.pathname.split('/')
    const id = Number(parts[2])
    const body = await parseBody(req)
    const file = JSON.parse(body)
    data.documentFiles[id] = { name: file.name, content: file.content }
    res.statusCode = 201
    res.end()
    return true
  }

  if (method === 'DELETE' && parsed.pathname.startsWith('/documents/')) {
    const id = Number(parsed.pathname.split('/')[2])
    data.documents = data.documents.filter(d => d.id !== id)
    delete data.documentFiles[id]
    res.statusCode = 204
    res.end()
    return true
  }

  if (method === 'POST' && parsed.pathname === '/admin/clearDocuments') {
    data.documents = []
    data.documentFiles = {}
    res.statusCode = 204
    res.end()
    return true
  }

  if (method === 'POST' && parsed.pathname === '/admin/setDocuments') {
    const body = await parseBody(req)
    data.documents = JSON.parse(body)
    data.documentFiles = {}
    res.statusCode = 204
    res.end()
    return true
  }

  return false
}
