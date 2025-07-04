import { Topic } from './Topic'

export interface ChatMessage {
  sender: 'user' | 'assistant'
  text: string
  isError?: boolean
}

export class Chat {
  id: string
  title: string
  description: string
  messages: ChatMessage[]
  topic: Topic

  constructor(
    id: string,
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
