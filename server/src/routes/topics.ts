import http from 'node:http'
import { data } from '../data/data'

export async function handleTopicRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  parsed: URL
): Promise<boolean> {
  const { method } = req

  if (method === 'GET' && /\/topics\/\d+\/markdown/.test(parsed.pathname)) {
    const id = Number(parsed.pathname.split('/')[2])
    const content = data.topicMarkdown[id]
    if (content === undefined) {
      res.statusCode = 404
      res.end('Not Found')
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ content }))
    }
    return true
  }

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
