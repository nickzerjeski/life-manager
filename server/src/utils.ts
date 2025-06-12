import axios from 'axios'
import http from 'node:http'

export function parseBody(req: http.IncomingMessage): Promise<string> {
  return new Promise(resolve => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })
    req.on('end', () => resolve(body))
  })
}

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
