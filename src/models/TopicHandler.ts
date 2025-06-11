import { Topic } from './Topic'
import { Project } from './Project'
import { Goal } from './Goal'

interface TopicDTO {
  id: number
  name: string
  project: {
    id: number
    name: string
    description: string
    start: number
    current: number
    objective: number
    period: [string, string]
    goal: {
      id: number
      name: string
      description: string
      start: number
      current: number
      objective: number
      period: [string, string]
      aol: string
    }
    contributionPct: number
  }
}

export class TopicHandler {
  private static instance: TopicHandler | null = null

  private baseUrl: string

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  static getInstance(baseUrl = 'http://localhost:3001'): TopicHandler {
    if (!TopicHandler.instance) {
      TopicHandler.instance = new TopicHandler(baseUrl)
    }
    return TopicHandler.instance
  }

  static reset(): void {
    TopicHandler.instance = null
  }

  async getTopicsForProject(projectId: number): Promise<Topic[]> {
    const res = await fetch(`${this.baseUrl}/topics?projectId=${projectId}`)
    if (!res.ok) return []
    const data = (await res.json()) as TopicDTO[]
    return data.map(t =>
      new Topic(
        t.id,
        t.name,
        new Project(
          t.project.id,
          t.project.name,
          t.project.description,
          t.project.start,
          t.project.current,
          t.project.objective,
          [new Date(t.project.period[0]), new Date(t.project.period[1])],
          new Goal(
            t.project.goal.id,
            t.project.goal.name,
            t.project.goal.description,
            t.project.goal.start,
            t.project.goal.current,
            t.project.goal.objective,
            [new Date(t.project.goal.period[0]), new Date(t.project.goal.period[1])],
            t.project.goal.aol,
          ),
          t.project.contributionPct,
        )
      )
    )
  }

  async getMarkdownForTopic(topicId: number): Promise<string> {
    const res = await fetch(`${this.baseUrl}/topics/${topicId}/markdown`)
    if (!res.ok) return ''
    const data = (await res.json()) as { content: string }
    return data.content
  }
}
