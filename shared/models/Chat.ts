import { Topic } from './Topic'

export interface ChatMessage {
  sender: 'user' | 'assistant'
  text: string
}

export class Chat {
  id: number
  title: string
  description: string
  messages: ChatMessage[]
  topic: Topic

  constructor(
    id: number,
    title: string,
    description: string,
    messages: ChatMessage[],
    topic: Topic
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.messages = messages
    this.topic = topic
  }
}
