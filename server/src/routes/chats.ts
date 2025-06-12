import http from 'node:http'
import { data } from '../data/data'

/**
 * Handle chat query endpoints.
 */
export async function handleChatRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  parsed: URL
): Promise<boolean> {
  const { method } = req

  if (method === 'GET' && parsed.pathname === '/chats') {
    const topicId = parsed.searchParams.get('topicId')
    const result = topicId
      ? data.chats.filter(c => c.topic.id === Number(topicId))
      : data.chats
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result))
    return true
  }

  return false
}
