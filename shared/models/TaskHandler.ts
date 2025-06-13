import { Task, AutomatedTask, ManualTask, AutomationState } from './Task'
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
    return data.map((t: any) => {
      const project = new Project(
          t.project.id,
          t.project.name,
          t.project.shortDescription,
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
        )
      const common = [
        t.id,
        t.name,
        t.description,
        new Date(t.deadline),
        project,
        t.duration,
        [],
        t.completedAt ? new Date(t.completedAt) : null
      ] as const
      if (t.status) {
        return new AutomatedTask(
          common[0],
          common[1],
          common[2],
          common[3],
          common[4],
          common[5],
          t.status as AutomationState,
          common[6],
          common[7]
        )
      }
      return new ManualTask(...common)
    })
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
    const map = (t: any) => {
      const project = new Project(
        t.project.id,
        t.project.name,
        t.project.shortDescription,
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
      )
      const common = [
        t.id,
        t.name,
        t.description,
        new Date(t.deadline),
        project,
        t.duration,
        [],
        t.completedAt ? new Date(t.completedAt) : null
      ] as const
      if (t.status) {
        return new AutomatedTask(
          common[0],
          common[1],
          common[2],
          common[3],
          common[4],
          common[5],
          t.status as AutomationState,
          common[6],
          common[7]
        )
      }
      return new ManualTask(...common)
    }
    return Array.isArray(data) ? data.map(map) : [map(data)]
  }
}
