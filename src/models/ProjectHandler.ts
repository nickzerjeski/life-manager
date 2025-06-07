import { Project } from './Project'
import { GoalHandler } from './GoalHandler'
import { Status } from '@/types/Status'

/**
 * ProjectHandler manages projects and ensures they reference existing goals.
 */
export class ProjectHandler {
  private static instance: ProjectHandler | null = null

  private projects: Project[] = []
  private goalHandler: GoalHandler

  private constructor(goalHandler: GoalHandler) {
    this.goalHandler = goalHandler
    const goals = goalHandler.getGoals()
    this.projects = [
      new Project(
        1,
        'Solar Farm Expansion',
        'Expand the regional solar farm to 150\u202FMW capacity to support grid stability and meet renewable\u2011energy targets.',
        0,
        30,
        100,
        [new Date('2025-01-01'), new Date('2025-12-31')],
        Status.ON_TRACK,
        goals[1] || goals[0]
      ),
      new Project(
        2,
        'ERP Roll\u2011out',
        'Implement a company\u2011wide ERP solution to unify finance, supply\u2011chain, and HR operations across all business units.',
        0,
        70,
        100,
        [new Date('2024-06-01'), new Date('2025-06-30')],
        Status.AT_RISK,
        goals[0] || goals[1]
      ),
    ]
  }

  static getInstance(goalHandler?: GoalHandler): ProjectHandler {
    if (!ProjectHandler.instance) {
      if (!goalHandler) {
        throw new Error('ProjectHandler requires a GoalHandler instance on first call')
      }
      ProjectHandler.instance = new ProjectHandler(goalHandler)
    }
    return ProjectHandler.instance
  }

  /** Add a new project after validating its goal exists. */
  createProject(project: Project): void {
    if (!this.goalHandler.getGoals().some((g) => g.id === project.goal.id)) {
      throw new Error('Invalid goal for project')
    }
    this.projects.push(project)
  }

  /** Remove a project by id. */
  deleteProject(id: number): void {
    this.projects = this.projects.filter((p) => p.id !== id)
  }

  /** Remove all projects from the handler. Primarily for testing. */
  clearProjects(): void {
    this.projects = []
  }

  /** Replace projects with provided list. Useful for testing. */
  setProjects(projects: Project[]): void {
    this.projects = projects
  }

  /** Get all stored projects. */
  getProjects(): Project[] {
    return this.projects
  }

  /** Get projects associated with a specific goal id. */
  getProjectsForGoal(goalId: number): Project[] {
    return this.projects.filter((p) => p.goal.id === goalId)
  }
}
