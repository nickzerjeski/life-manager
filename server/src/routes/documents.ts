import http from 'node:http'
import { parseBody, sendRequest } from '../utils'
import { data } from '../data/data'
import { supabase } from '../supabaseClient'

let supabaseClient = supabase
let sendRequestFn = sendRequest

export function setSupabaseClient(client: typeof supabase): void {
  supabaseClient = client
}

export function setSendRequest(fn: typeof sendRequest): void {
  sendRequestFn = fn
}

/**
 * Handles document CRUD operations and file uploads.
 */
export async function handleDocumentRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  parsed: URL
): Promise<boolean> {
  const { method } = req

  if (method === 'GET' && parsed.pathname === '/documents') {
    const goalId = parsed.searchParams.get('goalId')
    const projectId = parsed.searchParams.get('projectId')
    const result = goalId
      ? data.documents.filter(d => d.goalId === Number(goalId))
      : projectId
        ? data.documents.filter(d => d.projectId === Number(projectId))
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
        projectId: doc.projectId,
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
    const file = JSON.parse(body) as { name: string; content: string; mimeType: string }
    const doc = data.documents.find(d => d.id === id)
    if (!doc) {
      res.statusCode = 404
      res.end('Not Found')
      return true
    }

    // Upload to Supabase bucket, creating the bucket if necessary
    const bucketName = 'documents'
    const { data: buckets } = await supabaseClient.storage.listBuckets()
    const exists = buckets?.some(b => b.name === bucketName)
    if (!exists) {
      const { error: createError } = await supabaseClient.storage.createBucket(bucketName, { public: true })
      if (createError) {
        res.statusCode = 500
        res.end('Bucket creation failed')
        return true
      }
    }

    const path = `goal-${doc.goalId || 'none'}/project-${doc.projectId || 'none'}/${file.name}`
    const { error } = await supabaseClient.storage
      .from(bucketName)
      .upload(path, Buffer.from(file.content, 'base64'), {
        contentType: file.mimeType,
        upsert: true,
      })
    if (error) {
      res.statusCode = 500
      res.end('Upload failed')
      return true
    }

    const { data: urlData } = supabaseClient.storage.from(bucketName).getPublicUrl(path)

    // Send payload to n8n webhook
    const n8nWebhookUrl = 'https://n8n.nickzerjeski.me/webhook-test/eea94cfd-2d7c-4fdb-addd-6cb200d07d04'
    const payload = {
      id,
      url: urlData.publicUrl,
      data: { fileName: file.name, mimeType: file.mimeType, data: file.content },
    }
    if (!process.env.SKIP_WEBHOOK) {
      await sendRequestFn(n8nWebhookUrl, payload)
    }

    // Store locally for demo purposes
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
