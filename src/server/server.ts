import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { Goal } from '../models/Goal'
import { Project } from '../models/Project'
import { Document } from '../models/Document'
import { Status } from '../types/Status'
import { AOL } from '../types/AOL'

let goals: Goal[] = []
let projects: Project[] = []
let documents: Document[] = []
// store uploaded file contents keyed by document id
let documentFiles: Record<number, { name: string; content: string }> = {}

function initData() {
  goals = [
    new Goal(
      1,
      'Complete project planning',
      'Define detailed steps and milestones',
      0,
      20,
      100,
      [new Date('2025-06-01'), new Date('2025-09-30')],
      Status.ON_TRACK,
      AOL.PURPOSE
    ),
    new Goal(
      2,
      'Start MVP implementation',
      'Develop and test core functionality',
      0,
      10,
      100,
      [new Date('2025-06-15'), new Date('2025-10-15')],
      Status.AT_RISK,
      AOL.GROWTH
    ),
    new Goal(
      3,
      'Prepare market launch',
      'Create marketing campaign and documentation',
      0,
      0,
      100,
      [new Date('2025-07-01'), new Date('2025-11-01')],
      Status.OFF_TRACK,
      AOL.FINANCES
    ),
  ]

  projects = [
    new Project(
      1,
      'Solar Farm Expansion',
      'Expand the regional solar farm to 150\u202FMW capacity to support grid stability and meet renewable\u2011energy targets.',
      0,
      30,
      100,
      [new Date('2025-01-01'), new Date('2025-12-31')],
      Status.ON_TRACK,
      goals[1] || goals[0]
    ),
    new Project(
      2,
      'ERP Roll\u2011out',
      'Implement a company\u2011wide ERP solution to unify finance, supply\u2011chain, and HR operations across all business units.',
      0,
      70,
      100,
      [new Date('2024-06-01'), new Date('2025-06-30')],
      Status.AT_RISK,
      goals[0] || goals[1]
    ),
  ]

  documents = [
    new Document(1, goals[0].id, 'Course-Info.pdf', 'pdf', new Date('2025-06-05')),
    new Document(2, goals[1].id, 'Specification.docx', 'docx', new Date('2025-06-10')),
  ]
  const pdfPath = path.join(__dirname, '../data/Course-Info.pdf')
  const pdfContent = fs.readFileSync(pdfPath).toString('base64')
  documentFiles = { 1: { name: 'Course-Info.pdf', content: pdfContent } }
}

initData()

function parseBody(req: http.IncomingMessage): Promise<string> {
  return new Promise(resolve => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })
    req.on('end', () => resolve(body))
  })
}

export function createServer() {
  return http.createServer(async (req, res) => {
    const { method, url } = req

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }
    const parsed = new URL(url || '/', 'http://localhost')

    if (method === 'GET' && parsed.pathname === '/goals') {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(goals))
      return
    }

    if (method === 'POST' && parsed.pathname === '/goals') {
      const body = await parseBody(req)
      const goal = JSON.parse(body)
      goals.push(goal)
      res.statusCode = 201
      res.end(JSON.stringify(goal))
      return
    }

    if (method === 'DELETE' && parsed.pathname.startsWith('/goals/')) {
      const id = Number(parsed.pathname.split('/')[2])
      goals = goals.filter(g => g.id !== id)
      res.statusCode = 204
      res.end()
      return
    }

    if (method === 'POST' && parsed.pathname === '/admin/clearGoals') {
      goals = []
      res.statusCode = 204
      res.end()
      return
    }

    if (method === 'POST' && parsed.pathname === '/admin/setGoals') {
      const body = await parseBody(req)
      goals = JSON.parse(body)
      res.statusCode = 204
      res.end()
      return
    }

    if (method === 'GET' && parsed.pathname === '/projects') {
      const goalId = parsed.searchParams.get('goalId')
      const result = goalId ? projects.filter(p => p.goal.id === Number(goalId)) : projects
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
      return
    }

    if (method === 'POST' && parsed.pathname === '/projects') {
      const body = await parseBody(req)
      const project = JSON.parse(body)
      projects.push(project)
      res.statusCode = 201
      res.end(JSON.stringify(project))
      return
    }

    if (method === 'POST' && parsed.pathname === '/projects/generate') {
      const body = await parseBody(req)
      const { goalId } = JSON.parse(body)
      const goal = goals.find(g => g.id === Number(goalId))
      if (!goal) {
        res.statusCode = 404
        res.end('Goal not found')
        return
      }

      /* Generate a dummy project based for the goal */
      // TODO: Create a call to n8n webhook to actually create goal
      const nextId = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1
      const project = new Project(
        nextId,
        'Generated Project',
        'Auto generated project',
        0,
        0,
        100,
        goal.period,
        Status.ON_TRACK,
        goal
      )
      /* --------------------------------------------- */

      projects.push(project)
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(project))
      return
    }

    if (method === 'DELETE' && parsed.pathname.startsWith('/projects/')) {
      const id = Number(parsed.pathname.split('/')[2])
      projects = projects.filter(p => p.id !== id)
      res.statusCode = 204
      res.end()
      return
    }

    if (method === 'POST' && parsed.pathname === '/admin/clearProjects') {
      projects = []
      res.statusCode = 204
      res.end()
      return
    }

    if (method === 'POST' && parsed.pathname === '/admin/setProjects') {
      const body = await parseBody(req)
      projects = JSON.parse(body)
      res.statusCode = 204
      res.end()
      return
    }

    if (method === 'GET' && parsed.pathname === '/documents') {
      const goalId = parsed.searchParams.get('goalId')
      const result = goalId
        ? documents.filter(d => d.goalId === Number(goalId))
        : documents
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
      return
    }

    if (
      method === 'GET' &&
      parsed.pathname.startsWith('/documents/') &&
      !parsed.pathname.endsWith('/upload')
    ) {
      const id = Number(parsed.pathname.split('/')[2])
      const doc = documents.find(d => d.id === id)
      if (!doc) {
        res.statusCode = 404
        res.end('Not Found')
        return
      }
      const file = documentFiles[id]
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          id: doc.id,
          goalId: doc.goalId,
          name: doc.name,
          type: doc.type,
          uploadDate: doc.uploadDate,
          content: file?.content || null,
        })
      )
      return
    }

    if (method === 'POST' && parsed.pathname === '/documents') {
      const body = await parseBody(req)
      const doc = JSON.parse(body)
      const nextId = documents.length ? Math.max(...documents.map(d => d.id)) + 1 : 1
      doc.id = doc.id || nextId
      documents.push(doc)
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(doc))
      return
    }

    if (
      method === 'POST' &&
      parsed.pathname.startsWith('/documents/') &&
      parsed.pathname.endsWith('/upload')
    ) {
      const parts = parsed.pathname.split('/')
      const id = Number(parts[2])
      const body = await parseBody(req)
      const file = JSON.parse(body)
      documentFiles[id] = { name: file.name, content: file.content }
      res.statusCode = 201
      res.end()
      return
    }

    if (method === 'DELETE' && parsed.pathname.startsWith('/documents/')) {
      const id = Number(parsed.pathname.split('/')[2])
      documents = documents.filter(d => d.id !== id)
      delete documentFiles[id]
      res.statusCode = 204
      res.end()
      return
    }

    if (method === 'POST' && parsed.pathname === '/admin/clearDocuments') {
      documents = []
      documentFiles = {}
      res.statusCode = 204
      res.end()
      return
    }

    if (method === 'POST' && parsed.pathname === '/admin/setDocuments') {
      const body = await parseBody(req)
      documents = JSON.parse(body)
      documentFiles = {}
      res.statusCode = 204
      res.end()
      return
    }

    res.statusCode = 404
    res.end('Not Found')
  })
}

// When executed directly via `npm run server`, start the HTTP server.
if (require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3001
  createServer().listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Server running on http://localhost:${port}`)
  })
}
