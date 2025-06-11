import http from 'node:http'
import { data } from '../../data/data'

export async function handleTopicRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  parsed: URL
): Promise<boolean> {
  const { method } = req

  if (method === 'GET' && parsed.pathname === '/topics') {
    const projectId = parsed.searchParams.get('projectId')
    const result = projectId
      ? data.topics.filter(t => t.project.id === Number(projectId))
      : data.topics
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result))
    return true
  }

  return false
}
