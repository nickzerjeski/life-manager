import { Task } from './Task'
import { Project } from './Project'
import { Goal } from './Goal'

export class TaskHandler {
  private static instance: TaskHandler | null = null

  private baseUrl: string

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  static getInstance(baseUrl = 'http://localhost:3001'): TaskHandler {
    if (!TaskHandler.instance) {
      TaskHandler.instance = new TaskHandler(baseUrl)
    }
    return TaskHandler.instance
  }

  static reset(): void {
    TaskHandler.instance = null
  }

  async getTasksForProject(projectId: number): Promise<Task[]> {
    const res = await fetch(`${this.baseUrl}/tasks?projectId=${projectId}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.map((t: any) =>
      new Task(
        t.id,
        t.description,
        new Date(t.deadline),
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
            t.project.goal.aol
          ),
          t.project.contributionPct
        ),
        t.duration
      )
    )
  }

  async generateTasks(projectId: number): Promise<Task[]> {
    const res = await fetch(`${this.baseUrl}/tasks/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId })
    })
    if (!res.ok) {
      throw new Error('Failed to generate tasks')
    }
    const data = await res.json()
    const map = (t: any) =>
      new Task(
        t.id,
        t.description,
        new Date(t.deadline),
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
            t.project.goal.aol
          ),
          t.project.contributionPct
        ),
        t.duration
      )
    return Array.isArray(data) ? data.map(map) : [map(data)]
  }
}
