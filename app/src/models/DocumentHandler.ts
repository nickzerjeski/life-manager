import supabase from '../../supabase'
import axios from 'axios'
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
    return data
      .filter(f => f.metadata) // folders have null metadata
      .map(
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
    const fullPath = `${user.id}/${relativePath}`
    await supabase.storage
      .from('documents')
      .upload(fullPath, file, { upsert: true })

    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
    if (webhookUrl) {
      try {
        const { data } = supabase.storage
          .from('documents')
          .getPublicUrl(fullPath)
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onerror = () => reject(reader.error)
          reader.onloadend = () => {
            const res = reader.result as string
            resolve(res.split(',')[1])
          }
          reader.readAsDataURL(file)
        })

        const pathParts = relativePath.split('/')
        pathParts.pop()
        const [goalId, projectId, topicId] = pathParts

        await axios.post(webhookUrl, {
          id: fullPath,
          goal_id: goalId,
          project_id: projectId,
          topic_id: topicId,
          url: data.publicUrl,
          data: {
            fileName: file.name,
            mimeType: file.type,
            data: base64,
          },
        })
      } catch (err) {
        /* eslint-disable no-console */
        console.error(err)
      }
    }
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

  private async listFilePaths(prefix: string): Promise<string[]> {
    const { data, error } = await supabase.storage.from('documents').list(prefix)
    if (error || !data) return []
    const results = await Promise.all(
      data.map(item => {
        const path = `${prefix}/${item.name}`
        if (item.metadata) {
          return Promise.resolve([path])
        }
        return this.listFilePaths(path)
      })
    )
    return results.flat()
  }

  async deleteFolder(prefix: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const fullPrefix = `${user.id}/${prefix}`
    const files = await this.listFilePaths(fullPrefix)
    if (files.length > 0) {
      await supabase.storage.from('documents').remove(files)
    }
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
    return this.getMarkdown(`${goalId}/${goalId}.md`)
  }

  async getMarkdownForProject(
    goalId: string,
    projectId: string
  ): Promise<string> {
    return this.getMarkdown(`${goalId}/${projectId}/${projectId}.md`)
  }

  async getMarkdownForTopic(
    goalId: string,
    projectId: string,
    topicId: string
  ): Promise<string> {
    return this.getMarkdown(
      `${goalId}/${projectId}/${topicId}/${topicId}.md`
    )
  }
}
