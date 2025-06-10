import http from 'node:http'
import { parseBody } from '../utils'
import { data } from '../../data/data'
import { Task } from '../../models/Task'

export async function handleTaskRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  parsed: URL
): Promise<boolean> {
  const { method } = req

  if (method === 'GET' && parsed.pathname === '/tasks') {
    const projectId = parsed.searchParams.get('projectId')
    const result = projectId
      ? data.tasks.filter(t => t.project.id === Number(projectId))
      : data.tasks
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result))
    return true
  }

  if (method === 'POST' && parsed.pathname === '/tasks') {
    const body = await parseBody(req)
    const task = JSON.parse(body)
    data.tasks.push(task)
    res.statusCode = 201
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(task))
    return true
  }

  if (method === 'POST' && parsed.pathname === '/tasks/generate') {
    const body = await parseBody(req)
    const { projectId } = JSON.parse(body)
    const project = data.projects.find(p => p.id === Number(projectId))
    if (!project) {
      res.statusCode = 404
      res.end('Project not found')
      return true
    }
    const nextId = data.tasks.length
      ? Math.max(...data.tasks.map(t => t.id)) + 1
      : 1
    const task = new Task(nextId, 'Generated Task', project.period[1], project, 3600)
    data.tasks.push(task)
    res.statusCode = 201
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(task))
    return true
  }

  if (method === 'DELETE' && parsed.pathname.startsWith('/tasks/')) {
    const id = Number(parsed.pathname.split('/')[2])
    data.tasks = data.tasks.filter(t => t.id !== id)
    res.statusCode = 204
    res.end()
    return true
  }

  if (method === 'POST' && parsed.pathname === '/admin/clearTasks') {
    data.tasks = []
    res.statusCode = 204
    res.end()
    return true
  }

  if (method === 'POST' && parsed.pathname === '/admin/setTasks') {
    const body = await parseBody(req)
    data.tasks = JSON.parse(body)
    res.statusCode = 204
    res.end()
    return true
  }

  return false
}
