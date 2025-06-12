import axios from 'axios'
import http from 'node:http'

/**
 * Collects the request body and resolves with the raw string once the stream
 * ends.
 */
export function parseBody(req: http.IncomingMessage): Promise<string> {
  return new Promise(resolve => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })
    req.on('end', () => resolve(body))
  })
}

/**
 * Helper used during development to POST JSON payloads to arbitrary URLs.
 */
export async function sendRequest(url: any, payload: any){
  try {
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (error) {
    console.error('Error sending data:', error)
  }
}
