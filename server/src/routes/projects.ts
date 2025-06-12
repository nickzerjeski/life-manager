import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'
import { data } from '../data/data'
import { parseBody, sendRequest } from '../utils'
import { Project } from '../../../shared/models/Project'
import { extractPdfContent } from '../../../shared/utils/fileConversion'

export async function handleProjectRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  parsed: URL
): Promise<boolean> {
  const { method } = req

  if (method === 'GET' && parsed.pathname === '/projects') {
    const goalId = parsed.searchParams.get('goalId')
    const result = goalId
      ? data.projects.filter(p => p.goal.id === Number(goalId))
      : data.projects
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result))
    return true
  }

  if (method === 'POST' && parsed.pathname === '/projects') {
    const body = await parseBody(req)
    const project = JSON.parse(body)
    data.projects.push(project)
    res.statusCode = 201
    res.end(JSON.stringify(project))
    return true
  }

  if (method === 'POST' && parsed.pathname === '/projects/generate') {
    const body = await parseBody(req)
    const { goalId } = JSON.parse(body)
    const goal = data.goals.find(g => g.id === Number(goalId))
    if (!goal) {
      res.statusCode = 404
      res.end('Goal not found')
      return true
    }

    // Generate a dummy project based for the goal
    const n8nWebhookUrl =
      'https://n8n.nickzerjeski.me/webhook-test/eea94cfd-2d7c-4fdb-addd-6cb200d07d04'
    const pdfPath = path.join(__dirname, '../data/Course-Info.pdf')
    const pdfContent = fs.readFileSync(pdfPath).toString('base64')
    const textContent = await extractPdfContent(pdfContent)
    const n8nPayload = { content: textContent }

    console.log(await sendRequest(n8nWebhookUrl, n8nPayload))

    const nextId = data.projects.length
      ? Math.max(...data.projects.map(p => p.id)) + 1
      : 1
    const project = new Project(
      nextId,
      'Generated Project',
      'Auto generated project',
      0,
      0,
      100,
      goal.period,
      goal,
      100
    )

    data.projects.push(project)
    res.statusCode = 201
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(project))
    return true
  }

  if (method === 'DELETE' && parsed.pathname.startsWith('/projects/')) {
    const id = Number(parsed.pathname.split('/')[2])
    data.projects = data.projects.filter(p => p.id !== id)
    res.statusCode = 204
    res.end()
    return true
  }

  if (method === 'POST' && parsed.pathname === '/admin/clearProjects') {
    data.projects = []
    res.statusCode = 204
    res.end()
    return true
  }

  if (method === 'POST' && parsed.pathname === '/admin/setProjects') {
    const body = await parseBody(req)
    data.projects = JSON.parse(body)
    res.statusCode = 204
    res.end()
    return true
  }

  return false
}
