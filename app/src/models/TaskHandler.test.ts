import { beforeEach, describe, expect, test, vi } from 'vitest'
import { TaskHandler } from './TaskHandler'
import { Task } from './Task'
import { Project } from './Project'
import { Goal } from './Goal'
import { AOL } from './AOL'

const { authGetUser, insert, from } = vi.hoisted(() => {
  const insert = vi.fn()
  const from = vi.fn(() => ({ insert }))
  return {
    authGetUser: vi.fn(),
    insert,
    from,
  }
})

vi.mock('../../supabase', () => ({ default: { auth: { getUser: authGetUser }, from } }))

beforeEach(() => {
  vi.clearAllMocks()
  TaskHandler.reset()
})

describe('TaskHandler', () => {
  test('createTask inserts task', async () => {
    authGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    insert.mockResolvedValue({})
    const goal = new Goal('g1', 'Goal', '', 0, 0, 0, [new Date(), new Date()], AOL.GROWTH)
    const project = new Project('p1', 'Project', '', 0, 0, 0, [new Date(), new Date()], goal, 0)
    const task = new Task('t1', 'Task', 'desc', new Date('2024-01-01'), project, 3600, [])
    await TaskHandler.getInstance().createTask(task)
    expect(from).toHaveBeenCalledWith('tasks')
    expect(insert).toHaveBeenCalledWith({
      id: 't1',
      user_id: 'u1',
      project_id: 'p1',
      name: 'Task',
      description: 'desc',
      deadline: task.deadline.toISOString(),
      duration: 3600,
      is_automated: false,
    })
  })
})
