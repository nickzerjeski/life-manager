import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ProjectHandler } from './ProjectHandler'
import { GoalHandler } from './GoalHandler'
import { Goal } from './Goal'
import { Project } from './Project'
import { AOL } from '@/types/AOL'
import { createServer } from '../server/server'

function createGoal(id: number): Goal {
  return new Goal(id, `g${id}`, '', 0, 0, 1, [new Date(), new Date()], AOL.GROWTH)
}

function createProject(id: number, goal: Goal): Project {
  return new Project(id, `p${id}`, '', 0, 0, 1, [new Date(), new Date()], goal, 10)
}

test('createProject adds a project', async () => {
  const server = createServer()
  await new Promise(resolve => server.listen(0, resolve))
  const { port } = server.address() as any
  GoalHandler.reset()
  ProjectHandler.reset()
  const goalHandler = GoalHandler.getInstance(`http://localhost:${port}`)
  const projectHandler = ProjectHandler.getInstance(goalHandler, `http://localhost:${port}`)
  await goalHandler.clearGoals()
  await projectHandler.clearProjects()
  const goal = createGoal(1)
  await goalHandler.createGoal(goal)
  await projectHandler.createProject(createProject(1, goal))
  const projects = await projectHandler.getProjects()
  assert.equal(projects.length, 1)
  assert.equal(projects[0].id, 1)
  server.close()
})

test('deleteProject removes the specified project', async () => {
  const server = createServer()
  await new Promise(resolve => server.listen(0, resolve))
  const { port } = server.address() as any
  GoalHandler.reset()
  ProjectHandler.reset()
  const goalHandler = GoalHandler.getInstance(`http://localhost:${port}`)
  const projectHandler = ProjectHandler.getInstance(goalHandler, `http://localhost:${port}`)
  await goalHandler.clearGoals()
  await projectHandler.clearProjects()
  const goal = createGoal(1)
  await goalHandler.createGoal(goal)
  await projectHandler.createProject(createProject(1, goal))
  await projectHandler.createProject(createProject(2, goal))
  await projectHandler.deleteProject(1)
  const projects = await projectHandler.getProjects()
  assert.equal(projects.length, 1)
  assert.equal(projects[0].id, 2)
  server.close()
})

test('getProjectsForGoal filters correctly', async () => {
  const server = createServer()
  await new Promise(resolve => server.listen(0, resolve))
  const { port } = server.address() as any
  GoalHandler.reset()
  ProjectHandler.reset()
  const goalHandler = GoalHandler.getInstance(`http://localhost:${port}`)
  const projectHandler = ProjectHandler.getInstance(goalHandler, `http://localhost:${port}`)
  await goalHandler.clearGoals()
  await projectHandler.clearProjects()
  const goal1 = createGoal(1)
  const goal2 = createGoal(2)
  await goalHandler.setGoals([goal1, goal2])
  await projectHandler.createProject(createProject(1, goal1))
  await projectHandler.createProject(createProject(2, goal2))
  await projectHandler.createProject(createProject(3, goal1))
  const filtered = await projectHandler.getProjectsForGoal(1)
  assert.equal(filtered.length, 2)
  assert.ok(filtered.every((p) => p.goal.id === 1))
  server.close()
})

test('getProjects returns projects with date objects', async () => {
  const server = createServer()
  await new Promise(resolve => server.listen(0, resolve))
  const { port } = server.address() as any
  GoalHandler.reset()
  ProjectHandler.reset()
  const goalHandler = GoalHandler.getInstance(`http://localhost:${port}`)
  const projectHandler = ProjectHandler.getInstance(goalHandler, `http://localhost:${port}`)
  await goalHandler.clearGoals()
  await projectHandler.clearProjects()
  const goal = createGoal(1)
  await goalHandler.createGoal(goal)
  await projectHandler.createProject(createProject(1, goal))
  const projects = await projectHandler.getProjects()
  assert.ok(projects[0].period[0] instanceof Date)
  assert.ok(projects[0].goal.period[0] instanceof Date)
  server.close()
})
