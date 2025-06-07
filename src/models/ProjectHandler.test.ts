import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ProjectHandler } from './ProjectHandler'
import { GoalHandler } from './GoalHandler'
import { Goal } from './Goal'
import { Project } from './Project'
import { Status } from '@/types/Status'
import { AOL } from '@/types/AOL'

function createGoal(id: number): Goal {
  return new Goal(id, `g${id}`, '', 0, 0, 1, [new Date(), new Date()], Status.NOT_STARTED, AOL.GROWTH)
}

function createProject(id: number, goal: Goal): Project {
  return new Project(id, `p${id}`, '', 0, 0, 1, [new Date(), new Date()], Status.NOT_STARTED, goal)
}

test('createProject adds a project', () => {
  const goalHandler = GoalHandler.getInstance()
  goalHandler.clearGoals()
  const goal = createGoal(1)
  goalHandler.createGoal(goal)

  const projectHandler = ProjectHandler.getInstance(goalHandler)
  projectHandler.clearProjects()
  projectHandler.createProject(createProject(1, goal))

  assert.equal(projectHandler.getProjects().length, 1)
  assert.equal(projectHandler.getProjects()[0].id, 1)
})

test('deleteProject removes the specified project', () => {
  const goalHandler = GoalHandler.getInstance()
  goalHandler.clearGoals()
  const goal = createGoal(1)
  goalHandler.createGoal(goal)

  const projectHandler = ProjectHandler.getInstance(goalHandler)
  projectHandler.clearProjects()
  projectHandler.createProject(createProject(1, goal))
  projectHandler.createProject(createProject(2, goal))

  projectHandler.deleteProject(1)
  assert.equal(projectHandler.getProjects().length, 1)
  assert.equal(projectHandler.getProjects()[0].id, 2)
})

test('getProjectsForGoal filters correctly', () => {
  const goalHandler = GoalHandler.getInstance()
  goalHandler.clearGoals()
  const goal1 = createGoal(1)
  const goal2 = createGoal(2)
  goalHandler.setGoals([goal1, goal2])

  const projectHandler = ProjectHandler.getInstance(goalHandler)
  projectHandler.clearProjects()
  projectHandler.createProject(createProject(1, goal1))
  projectHandler.createProject(createProject(2, goal2))
  projectHandler.createProject(createProject(3, goal1))

  const filtered = projectHandler.getProjectsForGoal(1)
  assert.equal(filtered.length, 2)
  assert.ok(filtered.every((p) => p.goal.id === 1))
})
