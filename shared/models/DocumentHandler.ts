import { Document } from './Document'

/**
 * DocumentHandler manages document persistence on the backend server.
 */
export class DocumentHandler {
  private static instance: DocumentHandler | null = null

  private baseUrl: string

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  static getInstance(baseUrl = 'http://localhost:3001'): DocumentHandler {
    if (!DocumentHandler.instance) {
      DocumentHandler.instance = new DocumentHandler(baseUrl)
    }
    return DocumentHandler.instance
  }

  /** Reset the singleton instance (primarily for tests). */
  static reset(): void {
    DocumentHandler.instance = null
  }

  /** Fetch all documents belonging to a specific goal. */
  async getDocumentsForGoal(goalId: number): Promise<Document[]> {
    const res = await fetch(`${this.baseUrl}/documents?goalId=${goalId}`)
    if (!res.ok) return []
    try {
      const data = await res.json()
      return data.map(
        (d: any) =>
          new Document(
            d.id,
            { goalId: d.goalId, projectId: d.projectId },
            d.name,
            d.type,
            new Date(d.uploadDate)
          )
      )
    } catch {
      return []
    }
  }

  /** Fetch all documents belonging to a specific project. */
  async getDocumentsForProject(projectId: number): Promise<Document[]> {
    const res = await fetch(`${this.baseUrl}/documents?projectId=${projectId}`)
    if (!res.ok) return []
    try {
      const data = await res.json()
      return data.map(
        (d: any) =>
          new Document(
            d.id,
            { goalId: d.goalId, projectId: d.projectId },
            d.name,
            d.type,
            new Date(d.uploadDate)
          )
      )
    } catch {
      return []
    }
  }

  /** Create a new document entry and return the created item. */
  async createDocument(document: Document): Promise<Document> {
    const res = await fetch(`${this.baseUrl}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document),
    })
    if (!res.ok) {
      throw new Error('Failed to create document')
    }
    const data = await res.json()
    return new Document(
      data.id,
      { goalId: data.goalId, projectId: data.projectId },
      data.name,
      data.type,
      new Date(data.uploadDate)
    )
  }

  /** Upload file contents for an existing document. */
  async uploadDocument(documentId: number, file: File): Promise<void> {
    let content: string
    if (file.type.startsWith('text/')) {
      content = await file.text()
    } else {
      const buffer = await file.arrayBuffer()
      content = this.arrayBufferToBase64(buffer)
    }
    const res = await fetch(`${this.baseUrl}/documents/${documentId}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, content, mimeType: file.type }),
    })
    if (!res.ok) {
      throw new Error('Failed to upload document')
    }
  }

  /** Retrieve a single document including its file content. */
  async getDocument(id: number): Promise<{ name: string; type: string; content: string | null }> {
    const res = await fetch(`${this.baseUrl}/documents/${id}`)
    if (!res.ok) {
      throw new Error('Failed to fetch document')
    }
    const data = await res.json()
    let { content } = data
    if (content && data.type === 'txt') {
      try {
        content = atob(content)
      } catch {
        // not base64 encoded; use as-is
      }
    }
    return { name: data.name, type: data.type, content }
  }

  /** Delete a document by id. */
  async deleteDocument(id: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/documents/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      throw new Error('Failed to delete document')
    }
  }

  /** Convert an ArrayBuffer to a base64 encoded string. */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.byteLength; i += 1) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }
}
