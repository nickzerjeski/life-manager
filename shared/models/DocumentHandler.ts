import { Document } from './Document'
import supabase from '../db/supabase'

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  bytes.forEach(b => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export class DocumentHandler {
  private static instance: DocumentHandler | null = null

  static getInstance(): DocumentHandler {
    if (!DocumentHandler.instance) DocumentHandler.instance = new DocumentHandler()
    return DocumentHandler.instance
  }

  static reset(): void { DocumentHandler.instance = null }

  private constructor() {}

  async getDocumentsForGoal(goalId: string): Promise<Document[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: goal } = await supabase
      .from('goals')
      .select('name')
      .eq('id', goalId)
      .single()
    const path = `${user.id}/${goalId}`
    const { data: files } = await supabase.storage
      .from('documents')
      .list(path)
    if (!files) return []

    return files
      .filter(f => !f.name.endsWith('/') && f.name !== `${goal?.name}.md`)
      .map(f => {
        const decoded = decodeURIComponent(f.name)
        return new Document(
          `${path}/${f.name}`,
          { goalId },
          decoded,
          decoded.split('.').pop() || '',
          new Date(f.updated_at || f.created_at || '')
        )
      })
  }

  async getDocumentsForProject(projectId: string): Promise<Document[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: project } = await supabase
      .from('projects')
      .select('name, goal_id')
      .eq('id', projectId)
      .single()
    if (!project) return []
    const path = `${user.id}/${project.goal_id}/${projectId}`
    const { data: files } = await supabase.storage
      .from('documents')
      .list(path)
    if (!files) return []

    return files
      .filter(f => !f.name.endsWith('/') && f.name !== `${project.name}.md`)
      .map(f => {
        const decoded = decodeURIComponent(f.name)
        return new Document(
          `${path}/${f.name}`,
          { goalId: project.goal_id, projectId },
          decoded,
          decoded.split('.').pop() || '',
          new Date(f.updated_at || f.created_at || '')
        )
      })
  }

  async createDocument(document: Document): Promise<Document> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return document
    let goalId = document.goalId
    if (!goalId && document.projectId) {
      const { data: project } = await supabase
        .from('projects')
        .select('goal_id')
        .eq('id', document.projectId)
        .single()
      goalId = project?.goal_id
    }
    if (!goalId) return document
    const safeName = encodeURIComponent(document.name)
    const path = document.projectId
      ? `${user.id}/${goalId}/${document.projectId}/${safeName}`
      : `${user.id}/${goalId}/${safeName}`
    return new Document(path, { goalId, projectId: document.projectId }, document.name, document.type, document.uploadDate)
  }

  async uploadDocument(documentId: string, file: File | Blob): Promise<void> {
    const base64 = await fileToBase64(file)
    const arrayBuffer = base64ToArrayBuffer(base64)
    const fileType = (file as File).type || 'application/octet-stream'
    await supabase.storage
      .from('documents')
      .upload(documentId, arrayBuffer, { upsert: true, contentType: fileType })
  }

  async getDocument(id: string): Promise<{ name: string; type: string; content: string | null }> {
    const { data } = await supabase.storage.from('documents').download(id)
    if (!data) return { name: '', type: '', content: null }
    const name = id.split('/').pop() || ''
    const type = name.split('.').pop() || ''
    if (type === 'pdf') {
      const buffer = await data.arrayBuffer()
      return { name, type, content: arrayBufferToBase64(buffer) }
    }
    return { name, type, content: await data.text() }
  }

  async deleteDocument(id: string): Promise<void> {
    await supabase.storage.from('documents').remove([id])
  }
}
