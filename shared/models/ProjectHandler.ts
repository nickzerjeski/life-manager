import { Project } from './Project'
import { Goal } from './Goal'
import { GoalHandler } from './GoalHandler'

/**
 * ProjectHandler manages projects and ensures they reference existing goals.
 */
export class ProjectHandler {
  private static instance: ProjectHandler | null = null

  private goalHandler: GoalHandler
  private baseUrl: string

  private constructor(goalHandler: GoalHandler, baseUrl: string) {
    this.goalHandler = goalHandler
    this.baseUrl = baseUrl
  }

  static getInstance(goalHandler?: GoalHandler, baseUrl = 'http://localhost:3001'): ProjectHandler {
    if (!ProjectHandler.instance) {
      if (!goalHandler) {
        throw new Error('ProjectHandler requires a GoalHandler instance on first call')
      }
      ProjectHandler.instance = new ProjectHandler(goalHandler, baseUrl)
    }
    return ProjectHandler.instance
  }

  /** Reset the singleton instance (primarily for tests). */
  static reset(): void {
    ProjectHandler.instance = null
  }

  /** Add a new project after validating its goal exists. */
  async createProject(project: Project): Promise<void> {
    const goals = await this.goalHandler.getGoals()
    if (!goals.some((g) => g.id === project.goal.id)) {
      throw new Error('Invalid goal for project')
    }
    await fetch(`${this.baseUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })
  }

  /** Remove a project by id. */
  async deleteProject(id: number): Promise<void> {
    await fetch(`${this.baseUrl}/projects/${id}`, { method: 'DELETE' })
  }

  /** Remove all projects from the handler. Primarily for testing. */
  async clearProjects(): Promise<void> {
    await fetch(`${this.baseUrl}/admin/clearProjects`, { method: 'POST' })
  }

  /** Replace projects with provided list. Useful for testing. */
  async setProjects(projects: Project[]): Promise<void> {
    await fetch(`${this.baseUrl}/admin/setProjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projects),
    })
  }

  /** Get all stored projects. */
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${this.baseUrl}/projects`)
    const data = await res.json()
    return data.map(
      (p: any) =>
        new Project(
          p.id,
          p.name,
          p.shortDescription,
          p.description,
          p.start,
          p.current,
          p.objective,
          [new Date(p.period[0]), new Date(p.period[1])],
          new Goal(
            p.goal.id,
            p.goal.name,
            p.goal.description,
            p.goal.start,
            p.goal.current,
            p.goal.objective,
            [new Date(p.goal.period[0]), new Date(p.goal.period[1])],
            p.goal.aol
          ),
          p.contributionPct
        )
    )
  }

  /** Get projects associated with a specific goal id. */
  async getProjectsForGoal(goalId: number): Promise<Project[]> {
    const res = await fetch(`${this.baseUrl}/projects?goalId=${goalId}`)
    const data = await res.json()
    return data.map(
      (p: any) =>
        new Project(
          p.id,
          p.name,
          p.shortDescription,
          p.description,
          p.start,
          p.current,
          p.objective,
          [new Date(p.period[0]), new Date(p.period[1])],
          new Goal(
            p.goal.id,
            p.goal.name,
            p.goal.description,
            p.goal.start,
            p.goal.current,
            p.goal.objective,
            [new Date(p.goal.period[0]), new Date(p.goal.period[1])],
            p.goal.aol
          ),
          p.contributionPct
        )
    )
  }

  /** Request project generation for a goal. */
  async generateProjects(goalId: number): Promise<Project[]> {
    const res = await fetch(`${this.baseUrl}/projects/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goalId })
    })
    if (!res.ok) {
      throw new Error('Failed to generate projects')
    }
    const data = await res.json()
    const map = (p: any) =>
      new Project(
        p.id,
        p.name,
        p.shortDescription,
        p.description,
        p.start,
        p.current,
        p.objective,
        [new Date(p.period[0]), new Date(p.period[1])],
        new Goal(
          p.goal.id,
          p.goal.name,
          p.goal.description,
          p.goal.start,
          p.goal.current,
          p.goal.objective,
          [new Date(p.goal.period[0]), new Date(p.goal.period[1])],
          p.goal.aol
        ),
        p.contributionPct
      )
    return Array.isArray(data) ? data.map(map) : [map(data)]
  }
}
