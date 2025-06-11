import { Chat } from './Chat'
import { Topic } from './Topic'
import { Project } from './Project'
import { Goal } from './Goal'

export class ChatHandler {
  private static instance: ChatHandler | null = null
  private baseUrl: string

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  static getInstance(baseUrl = 'http://localhost:3001'): ChatHandler {
    if (!ChatHandler.instance) {
      ChatHandler.instance = new ChatHandler(baseUrl)
    }
    return ChatHandler.instance
  }

  static reset(): void {
    ChatHandler.instance = null
  }

  async getChatsForTopic(topicId: number): Promise<Chat[]> {
    const res = await fetch(`${this.baseUrl}/chats?topicId=${topicId}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.map((c: any) =>
      new Chat(
        c.id,
        c.title,
        c.description,
        c.messages,
        new Topic(
          c.topic.id,
          c.topic.name,
          new Project(
            c.topic.project.id,
            c.topic.project.name,
            c.topic.project.description,
            c.topic.project.start,
            c.topic.project.current,
            c.topic.project.objective,
            [new Date(c.topic.project.period[0]), new Date(c.topic.project.period[1])],
            new Goal(
              c.topic.project.goal.id,
              c.topic.project.goal.name,
              c.topic.project.goal.description,
              c.topic.project.goal.start,
              c.topic.project.goal.current,
              c.topic.project.goal.objective,
              [new Date(c.topic.project.goal.period[0]), new Date(c.topic.project.goal.period[1])],
              c.topic.project.goal.aol
            ),
            c.topic.project.contributionPct
          )
        )
      )
    )
  }
}
