import supabase from '../db/supabase'
import { Project } from './Project'
import { Goal } from './Goal'

export class ProjectHandler {
  private static instance: ProjectHandler | null = null

  static getInstance(): ProjectHandler {
    if (!ProjectHandler.instance) ProjectHandler.instance = new ProjectHandler()
    return ProjectHandler.instance
  }

  static reset(): void { ProjectHandler.instance = null }

  private constructor() {}

  async createProject(project: Project): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('projects').insert({
      user_id: user.id,
      goal_id: project.goal.id,
      name: project.name,
      short_description: project.shortDescription,
      description: project.description,
      start: project.start,
      current: project.current,
      objective: project.objective,
      period_from: project.period[0].toISOString().slice(0,10),
      period_to: project.period[1].toISOString().slice(0,10),
      contribution_pct: project.contributionPct,
      status: project.status,
    })
  }

  async deleteProject(id: string): Promise<void> {
    await supabase.from('projects').delete().eq('id', id)
  }

  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*, goals!inner(*)')
    if (error || !data) return []
    return data.map(p => new Project(
      p.id,
      p.name,
      p.short_description ?? '',
      p.description ?? '',
      p.start,
      p.current,
      p.objective,
      [new Date(p.period_from), new Date(p.period_to)],
      new Goal(
        p.goals.id,
        p.goals.name,
        p.goals.description,
        p.goals.start,
        p.goals.current,
        p.goals.objective,
        [new Date(p.goals.period_from), new Date(p.goals.period_to)],
        p.goals.area_of_life,
      ),
      p.contribution_pct,
    ))
  }

  async getProjectsForGoal(goalId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*, goals!inner(*)')
      .eq('goal_id', goalId)
    if (error || !data) return []
    return data.map(p => new Project(
      p.id,
      p.name,
      p.short_description ?? '',
      p.description ?? '',
      p.start,
      p.current,
      p.objective,
      [new Date(p.period_from), new Date(p.period_to)],
      new Goal(
        p.goals.id,
        p.goals.name,
        p.goals.description,
        p.goals.start,
        p.goals.current,
        p.goals.objective,
        [new Date(p.goals.period_from), new Date(p.goals.period_to)],
        p.goals.area_of_life,
      ),
      p.contribution_pct,
    ))
  }
}
