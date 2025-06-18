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

  private async list(prefix: string): Promise<Document[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []
    const path = `${user.id}/${prefix}`
    const { data, error } = await supabase.storage
      .from('documents')
      .list(path)
    if (error || !data) return []
    return data.map(
      f =>
        new Document(
          `${path}/${f.name}`,
          {},
          f.name,
          f.name.split('.').pop()?.toLowerCase() || '',
          new Date(f.updated_at)
        )
    )
  }

  async getDocumentsForGoal(goalId: string): Promise<Document[]> {
    return this.list(`${goalId}`)
  }

  async getDocumentsForProject(goalId: string, projectId: string): Promise<Document[]> {
    return this.list(`${goalId}/${projectId}`)
  }

  async uploadDocument(relativePath: string, file: File): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    await supabase.storage
      .from('documents')
      .upload(`${user.id}/${relativePath}`, file, { upsert: true })
  }

  async getDocument(fullPath: string): Promise<{ name: string; type: string; content: string | null }> {
    const { data, error } = await supabase.storage.from('documents').download(fullPath)
    if (error || !data) return { name: '', type: '', content: null }
    const type = fullPath.split('.').pop()?.toLowerCase() || ''
    if (type === 'txt') {
      return { name: fullPath.split('/').pop() || '', type, content: await data.text() }
    }
    if (type === 'pdf') {
      const reader = new FileReader()
      const promise = new Promise<string>((resolve, reject) => {
        reader.onerror = () => reject(reader.error)
        reader.onloadend = () => {
          const res = reader.result as string
          resolve(res.split(',')[1])
        }
      })
      reader.readAsDataURL(data)
      return { name: fullPath.split('/').pop() || '', type, content: await promise }
    }
    return { name: fullPath.split('/').pop() || '', type, content: null }
  }

  async deleteDocument(fullPath: string): Promise<void> {
    await supabase.storage.from('documents').remove([fullPath])
  }

  async uploadMarkdown(relativePath: string, content: string): Promise<void> {
    const file = new File(
      [content],
      relativePath.split('/').pop() || 'note.md',
      { type: 'text/markdown' }
    )
    await this.uploadDocument(relativePath, file)
  }

  async getMarkdown(relativePath: string): Promise<string> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return ''
    const { data, error } = await supabase.storage
      .from('documents')
      .download(`${user.id}/${relativePath}`)
    if (error || !data) return ''
    return data.text()
  }

  async getMarkdownForGoal(goalId: string): Promise<string> {
    return this.getMarkdown(`${goalId}/goal.${goalId}.md`)
  }

  async getMarkdownForProject(
    goalId: string,
    projectId: string
  ): Promise<string> {
    return this.getMarkdown(`${goalId}/${projectId}/project.${projectId}.md`)
  }

  async getMarkdownForTopic(
    goalId: string,
    projectId: string,
    topicId: string
  ): Promise<string> {
    return this.getMarkdown(
      `${goalId}/${projectId}/${topicId}/topic.${topicId}.md`
    )
  }
}
