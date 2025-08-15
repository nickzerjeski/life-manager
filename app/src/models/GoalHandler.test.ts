import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Goal } from './Goal'
import { AOL } from './AOL'
import { GoalHandler } from './GoalHandler'
import { MOCK_MARKDOWN } from '../utils/mockMarkdown'

const {
  authGetUser,
  single,
  select,
  insert,
  eq,
  del,
  from,
  uploadMarkdown,
  deleteFolder,
  getProjectsForGoal,
  deleteProject,
} = vi.hoisted(() => {
  const single = vi.fn()
  const select = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select }))
  const eq = vi.fn()
  const del = vi.fn(() => ({ eq }))
  const from = vi.fn(() => ({ insert, delete: del }))
  return {
    authGetUser: vi.fn(),
    single,
    select,
    insert,
    eq,
    del,
    from,
    uploadMarkdown: vi.fn(),
    deleteFolder: vi.fn(),
    getProjectsForGoal: vi.fn(),
    deleteProject: vi.fn(),
  }
})

vi.mock('../../supabase', () => ({ default: { auth: { getUser: authGetUser }, from } }))

vi.mock('./DocumentHandler', () => ({
  DocumentHandler: { getInstance: () => ({ uploadMarkdown, deleteFolder }) },
}))

vi.mock('./ProjectHandler', () => ({
  ProjectHandler: { getInstance: () => ({ getProjectsForGoal, deleteProject }) },
}))

beforeEach(() => {
  vi.clearAllMocks()
  GoalHandler.reset()
})

describe('GoalHandler', () => {
  test('createGoal inserts goal and uploads markdown', async () => {
    authGetUser.mockResolvedValue({ data: { user: { id: 'user1' } } })
    single.mockResolvedValue({ data: { id: 'g1' }, error: null })
    const goal = new Goal('', 'Goal', 'desc', 0, 0, 10, [new Date(), new Date()], AOL.GROWTH)

    await GoalHandler.getInstance().createGoal(goal)

    expect(insert).toHaveBeenCalled()
    expect(goal.id).toBe('g1')
    expect(uploadMarkdown).toHaveBeenCalledWith('g1/g1.md', MOCK_MARKDOWN)
  })

  test('deleteGoal removes related data', async () => {
    getProjectsForGoal.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }])
    eq.mockResolvedValue({})

    await GoalHandler.getInstance().deleteGoal('g1')

    expect(getProjectsForGoal).toHaveBeenCalledWith('g1')
    expect(deleteProject).toHaveBeenCalledWith('p1')
    expect(deleteProject).toHaveBeenCalledWith('p2')
    expect(deleteFolder).toHaveBeenCalledWith('g1')
    expect(del).toHaveBeenCalled()
    expect(eq).toHaveBeenCalledWith('id', 'g1')
  })
})

