import supabase from '../db/supabase'
import { Document } from './Document'

export class DocumentHandler {
  private static instance: DocumentHandler | null = null

  static getInstance(): DocumentHandler {
    if (!DocumentHandler.instance) DocumentHandler.instance = new DocumentHandler()
    return DocumentHandler.instance
  }

  static reset(): void { DocumentHandler.instance = null }

  private constructor() {}

  async getDocumentsForGoal(_goalId: string): Promise<Document[]> {
    return []
  }

  async getDocumentsForProject(_projectId: string): Promise<Document[]> {
    return []
  }

  async createDocument(_document: Document): Promise<Document> {
    return _document
  }

  async uploadDocument(documentId: string, file: File): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const path = `${user.id}/${documentId}/${file.name}`
    const { error } = await supabase.storage.from('documents').upload(path, file)
    if (error) throw error
  }

  async getDocument(_id: string): Promise<{ name: string; type: string; content: string | null }> {
    return { name: '', type: '', content: null }
  }

  async deleteDocument(_id: string): Promise<void> {}
}
