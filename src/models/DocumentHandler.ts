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
    const data = await res.json()
    return data.map(
      (d: any) => new Document(d.id, d.goalId, d.name, d.type, new Date(d.uploadDate))
    )
  }

  /** Create a new document entry. */
  async createDocument(document: Document): Promise<void> {
    await fetch(`${this.baseUrl}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document),
    })
  }
}
