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
