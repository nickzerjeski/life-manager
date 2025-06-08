import http from 'node:http'
import { Goal } from '../models/Goal'
import { Project } from '../models/Project'
import { Status } from '../types/Status'
import { AOL } from '../types/AOL'

let goals: Goal[] = []
let projects: Project[] = []

function initData() {
  goals = [
    new Goal(
      1,
      'Projektplanung abschließen',
      'Detaillierte Schritte und Meilensteine festlegen',
      0,
      20,
      100,
      [new Date('2025-06-01'), new Date('2025-09-30')],
      Status.ON_TRACK,
      AOL.PURPOSE
    ),
    new Goal(
      2,
      'MVP-Implementierung starten',
      'Kernfunktionalität entwickeln und testen',
      0,
      10,
      100,
      [new Date('2025-06-15'), new Date('2025-10-15')],
      Status.AT_RISK,
      AOL.GROWTH
    ),
    new Goal(
      3,
      'Markteinführung vorbereiten',
      'Marketing-Kampagne und Dokumentation erstellen',
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

    res.statusCode = 404
    res.end('Not Found')
  })
}
