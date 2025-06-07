import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Goal } from './Goal'
import { GoalHandler } from './GoalHandler'
import { Status } from '@/types/Status'
import { AOL } from '@/types/AOL'

function createSampleGoal(id: number): Goal {
  return new Goal(id, `goal${id}`, '', 0, 0, 1, [new Date(), new Date()], Status.NotStarted, AOL.Health)
}

test('createGoal adds a goal to the handler', () => {
  const handler = new GoalHandler()
  const goal = createSampleGoal(1)
  handler.createGoal(goal)
  assert.equal(handler.getGoals().length, 1)
  assert.equal(handler.getGoals()[0].id, 1)
})

test('deleteGoal removes the specified goal', () => {
  const handler = new GoalHandler()
  handler.createGoal(createSampleGoal(1))
  handler.createGoal(createSampleGoal(2))
  handler.deleteGoal(1)
  assert.equal(handler.getGoals().length, 1)
  assert.equal(handler.getGoals()[0].id, 2)
})
