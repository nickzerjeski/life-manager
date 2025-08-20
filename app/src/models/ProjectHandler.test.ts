import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Project } from './Project'
import { Goal } from './Goal'
import { AOL } from './AOL'
import { ProjectHandler } from './ProjectHandler'

const {
  authGetUser,
  single,
  select,
  insert,
  from,
  uploadMarkdown,
} = vi.hoisted(() => {
  const single = vi.fn()
  const select = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select }))
  const from = vi.fn(() => ({ insert }))
  return {
    authGetUser: vi.fn(),
    single,
    select,
    insert,
    from,
    uploadMarkdown: vi.fn(),
  }
})

vi.mock('../../supabase', () => ({ default: { auth: { getUser: authGetUser }, from } }))
vi.mock('./DocumentHandler', () => ({
  DocumentHandler: { getInstance: () => ({ uploadMarkdown }) },
}))

beforeEach(() => {
  vi.clearAllMocks()
  ProjectHandler.reset()
})

describe('ProjectHandler', () => {
  test('createProject inserts project and uploads markdown', async () => {
    authGetUser.mockResolvedValue({ data: { user: { id: 'user1' } } })
    single.mockResolvedValue({ data: { id: 'p1' }, error: null })
    const goal = new Goal('g1', 'Goal', '', 0, 0, 10, [new Date(), new Date()], AOL.GROWTH)
    const project = new Project('', 'Proj', 'desc', 0, 0, 10, [new Date(), new Date()], goal, 0)

    await ProjectHandler.getInstance().createProject(project)

    expect(insert).toHaveBeenCalled()
    expect(project.id).toBe('p1')
    expect(uploadMarkdown).toHaveBeenCalledWith('g1/p1/p1.md', project.description)
  })
})

