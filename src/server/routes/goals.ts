import http from 'node:http'
import { parseBody } from '../utils'
import { data } from '../../data/data'

export async function handleGoalRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  parsed: URL
): Promise<boolean> {
  const { method } = req

  if (method === 'GET' && parsed.pathname === '/goals') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data.goals))
    return true
  }

  if (method === 'POST' && parsed.pathname === '/goals') {
    const body = await parseBody(req)
    const goal = JSON.parse(body)
    data.goals.push(goal)
    res.statusCode = 201
    res.end(JSON.stringify(goal))
    return true
  }

  if (method === 'DELETE' && parsed.pathname.startsWith('/goals/')) {
    const id = Number(parsed.pathname.split('/')[2])
    data.goals = data.goals.filter(g => g.id !== id)
    res.statusCode = 204
    res.end()
    return true
  }

  if (method === 'POST' && parsed.pathname === '/admin/clearGoals') {
    data.goals = []
    res.statusCode = 204
    res.end()
    return true
  }

  if (method === 'POST' && parsed.pathname === '/admin/setGoals') {
    const body = await parseBody(req)
    data.goals = JSON.parse(body)
    res.statusCode = 204
    res.end()
    return true
  }

  return false
}
