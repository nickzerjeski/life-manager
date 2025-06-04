import { useStore } from './store'

it('adds a goal', () => {
  const { addGoal, goals } = useStore.getState()
  addGoal({
    id: '1',
    name: 'Test',
    period: { from: '2024-01-01', to: '2024-12-31' },
    status: 'Not started',
    areaOfLife: 'Test',
    projects: [],
  })
  expect(useStore.getState().goals.length).toBe(goals.length + 1)
})

it('removes a goal', () => {
  const { addGoal, removeGoal } = useStore.getState()
  addGoal({
    id: 'remove',
    name: 'To remove',
    period: { from: '2024-01-01', to: '2024-12-31' },
    status: 'Not started',
    areaOfLife: 'Test',
    projects: [],
  })
  removeGoal('remove')
  expect(useStore.getState().goals.find((g) => g.id === 'remove')).toBeUndefined()
})
it('adds and removes a task', () => {
  const { addGoal, addProject, addTask, removeTask } = useStore.getState()
  const goalId = 'g1'
  const projectId = 'p1'
  addGoal({
    id: goalId,
    name: 'goal',
    period: { from: '2024-01-01', to: '2024-12-31' },
    status: 'Not started',
    areaOfLife: 'Test',
    projects: [],
  })
  addProject(goalId, { id: projectId, goalId, name: 'proj', period: { from: '2024-01-01', to: '2024-12-31' }, status: 'Not started', tasks: [] })
  const taskId = 't1'
  addTask(projectId, { id: taskId, name: 'task', description: '', duration: 60, priority: 3, dependencyIds: [], completed: false, date: '2024-06-01' })
  expect(useStore.getState().goals.find(g=>g.id===goalId)?.projects[0].tasks.length).toBe(1)
  removeTask(projectId, taskId)
  expect(useStore.getState().goals.find(g=>g.id===goalId)?.projects[0].tasks.length).toBe(0)
})
