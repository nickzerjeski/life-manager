import { describe, expect, test, vi, beforeEach } from 'vitest'

const {
  authGetUser,
  upload,
  download,
  remove,
  list,
  storageFrom,
  post,
} = vi.hoisted(() => {
  const upload = vi.fn()
  const download = vi.fn()
  const remove = vi.fn()
  const list = vi.fn()
  return {
    authGetUser: vi.fn(),
    upload,
    download,
    remove,
    list,
    storageFrom: vi.fn(() => ({ upload, download, remove, list })),
    post: vi.fn(),
  }
})

vi.mock('../../supabase', () => ({
  default: {
    auth: { getUser: authGetUser },
    storage: { from: storageFrom },
  },
}))

vi.mock('axios', () => ({ default: { post } }))

import { DocumentHandler } from './DocumentHandler'

beforeEach(() => {
  vi.clearAllMocks()
  DocumentHandler.reset()
  authGetUser.mockResolvedValue({ data: { user: { id: 'user1' } } })
  storageFrom.mockReturnValue({ upload, download, remove, list })
  upload.mockResolvedValue({})
  remove.mockResolvedValue({})
  post.mockResolvedValue({})
  vi.stubEnv('VITE_DOCUMENT_ENCODING_WEBHOOK', 'https://webhook.example.com')
  vi.stubEnv('VITE_SUPABASE_STORAGE_URL', 'https://storage.example.com')
})

describe('DocumentHandler', () => {
  test('uploadDocument uploads file and triggers webhook', async () => {
    const handler = DocumentHandler.getInstance()
    const file = new File(['hello'], 'file.txt', { type: 'text/plain' })

    await handler.uploadDocument('g1/p1/file.txt', file)

    expect(storageFrom).toHaveBeenCalledWith('documents')
    expect(upload).toHaveBeenCalledWith('user1/g1/p1/file.txt', file, { upsert: true })
    expect(post).toHaveBeenCalledWith(
      'https://webhook.example.com',
      {
        id: 'user1/g1/p1/file.txt',
        title: 'file.txt',
        type: 'text/plain',
        url: 'https://storage.example.com/documents/user1/g1/p1/file.txt',
        project_id: 'p1',
      },
      { headers: { 'Content-Type': 'application/json' } },
    )
  })

  test('getDocument downloads text content', async () => {
    const data = { text: () => Promise.resolve('content') } as any
    download.mockResolvedValue({ data, error: null })
    const handler = DocumentHandler.getInstance()

    const res = await handler.getDocument('g1/note.txt')

    expect(download).toHaveBeenCalledWith('user1/g1/note.txt')
    expect(res).toEqual({ name: 'note.txt', type: 'txt', content: 'content' })
  })

  test('deleteFolder removes all files under prefix', async () => {
    const handler = DocumentHandler.getInstance()
    const listSpy = vi
      .spyOn(handler as any, 'listFilePaths')
      .mockResolvedValue(['user1/g1/f1.txt', 'user1/g1/f2.txt'])

    await handler.deleteFolder('g1')

    expect(listSpy).toHaveBeenCalledWith('user1/g1')
    expect(remove).toHaveBeenCalledWith(['user1/g1/f1.txt', 'user1/g1/f2.txt'])
    listSpy.mockRestore()
  })
})

