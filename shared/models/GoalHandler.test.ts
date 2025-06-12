import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Goal } from './Goal'
import { GoalHandler } from './GoalHandler'
import { createServer } from '../server/server'
import { AOL } from '../types/AOL'

function createSampleGoal(id: number): Goal {
  return new Goal(
    id,
    `goal${id}`,
    '',
    0,
    0,
    1,
    [new Date(), new Date()],
    AOL.HEALTH
  )
}

test('createGoal adds a goal to the handler', async () => {
  const server = createServer()
  await new Promise(resolve => server.listen(0, resolve))
  const { port } = server.address() as any
  GoalHandler.reset()
  const handler = GoalHandler.getInstance(`http://localhost:${port}`)
  await handler.clearGoals()
  const goal = createSampleGoal(1)
  await handler.createGoal(goal)
  const goals = await handler.getGoals()
  assert.equal(goals.length, 1)
  assert.equal(goals[0].id, 1)
  server.close()
})

test('deleteGoal removes the specified goal', async () => {
  const server = createServer()
  await new Promise(resolve => server.listen(0, resolve))
  const { port } = server.address() as any
  GoalHandler.reset()
  const handler = GoalHandler.getInstance(`http://localhost:${port}`)
  await handler.clearGoals()
  await handler.createGoal(createSampleGoal(1))
  await handler.createGoal(createSampleGoal(2))
  await handler.deleteGoal(1)
  const goals = await handler.getGoals()
  assert.equal(goals.length, 1)
  assert.equal(goals[0].id, 2)
  server.close()
})

test('getGoals converts period to Date objects', async () => {
  const server = createServer()
  await new Promise(resolve => server.listen(0, resolve))
  const { port } = server.address() as any
  GoalHandler.reset()
  const handler = GoalHandler.getInstance(`http://localhost:${port}`)
  await handler.clearGoals()
  await handler.createGoal(createSampleGoal(1))
  const goals = await handler.getGoals()
  assert.ok(goals[0].period[0] instanceof Date)
  assert.ok(goals[0].period[1] instanceof Date)
  server.close()
})
