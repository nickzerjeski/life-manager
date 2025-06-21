import supabase from '../../supabase'
import axios from 'axios'
import { Document } from './Document'

/**
 * Singleton responsible for storing and retrieving files from Supabase.
 *
 * Files live under the `documents` bucket using the structure
 * `<user-id>/<goal-id>/<project-id?>/filename`.
 *
 * The handler also triggers a webhook when new documents are uploaded so
 * the backend can process them (e.g. generate embeddings).
 */

export class DocumentHandler {
  private static instance: DocumentHandler | null = null

  /**
   * Returns the singleton instance of the handler.
   */
  static getInstance(): DocumentHandler {
    if (!DocumentHandler.instance) DocumentHandler.instance = new DocumentHandler()
    return DocumentHandler.instance
  }

  /**
   * Clears the singleton instance. Used mainly in tests.
   */
  static reset(): void { DocumentHandler.instance = null }

  private constructor() {}

  /**
   * Lists documents stored under the provided prefix for the current user.
   */
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

  /**
   * Returns all documents uploaded for the given goal.
   */
  async getDocumentsForGoal(goalId: string): Promise<Document[]> {
    return this.list(`${goalId}`)
  }

  /**
   * Returns all documents uploaded for a specific project.
   */
  async getDocumentsForProject(goalId: string, projectId: string): Promise<Document[]> {
    return this.list(`${goalId}/${projectId}`)
  }

  /**
   * Uploads a file to Supabase and notifies the encoding webhook.
   *
   * Only one of `goal_id` or `project_id` is included in the webhook
   * payload depending on the destination folder. Topic documents are
   * currently not supported, so no topic information is sent.
   */
  async uploadDocument(relativePath: string, file: File): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const fullPath = `${user.id}/${relativePath}`
    await supabase.storage
      .from('documents')
      .upload(fullPath, file, { upsert: true })

    const webhookUrl = import.meta.env.VITE_DOCUMENT_ENCODING_WEBHOOK
    if (webhookUrl) {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/documents/${fullPath}`

        const pathParts = relativePath.split('/')
        pathParts.pop()
        const [goalId, projectId] = pathParts

        const payload: Record<string, string> = {
          id: fullPath,
          title: file.name,
          type: file.type,
          url,
        }

        if (projectId) {
          payload.project_id = projectId
        } else if (goalId) {
          payload.goal_id = goalId
        }

        await axios.post(
          webhookUrl,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
      } catch (err) {
        /* eslint-disable no-console */
        console.error(err)
      }
    }
  }

  /**
   * Downloads a file from Supabase and returns its content.
   */
  async getDocument(path: string): Promise<{ name: string; type: string; content: string | null }> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { name: '', type: '', content: null }

    const fullPath = path.startsWith(`${user.id}/`) ? path : `${user.id}/${path}`
    const { data, error } = await supabase.storage.from('documents').download(fullPath)
    if (error || !data) return { name: '', type: '', content: null }

    const type = fullPath.split('.').pop()?.toLowerCase() || ''

    if (type === 'txt' || type === 'md' || type === 'markdown') {
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

  /**
   * Deletes a single file from storage.
   */
  async deleteDocument(fullPath: string): Promise<void> {
    await supabase.storage.from('documents').remove([fullPath])
  }

  /**
   * Recursively collects all file paths under a given prefix.
   */
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

  /**
   * Deletes all files within the given folder prefix.
   */
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

  /**
   * Helper for uploading markdown notes.
   */
  async uploadMarkdown(relativePath: string, content: string): Promise<void> {
    const file = new File(
      [content],
      relativePath.split('/').pop() || 'note.md',
      { type: 'text/markdown' }
    )
    await this.uploadDocument(relativePath, file)
  }

}
