import supabase from '../db/supabase'
import { Project } from './Project'
import { Goal } from './Goal'
import { DocumentHandler } from './DocumentHandler'
import { TopicHandler } from './TopicHandler'
import { MOCK_MARKDOWN } from '../utils/mockMarkdown'

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
    const { data: inserted, error } = await supabase
      .from('projects')
      .insert({
      user_id: user.id,
      goal_id: project.goal.id,
      name: project.name,
      description: project.description,
      start: project.start,
      current: project.current,
      objective: project.objective,
      period_from: project.period[0].toISOString().slice(0,10),
      period_to: project.period[1].toISOString().slice(0,10),
      contribution_pct: project.contributionPct,
      status: project.status,
      })
      .select()
      .single()
    if (error || !inserted) return
    project.id = inserted.id
    await DocumentHandler.getInstance().uploadMarkdown(
      `${project.goal.id}/${project.id}/${project.id}.md`,
      MOCK_MARKDOWN
    )
  }

  async deleteProject(id: string): Promise<void> {
    const topicHandler = TopicHandler.getInstance()
    const topics = await topicHandler.getTopicsForProject(id)
    await Promise.all(topics.map(t => topicHandler.deleteTopic(t.id)))
    const { data } = await supabase
      .from('projects')
      .select('goal_id')
      .eq('id', id)
      .single()
    if (data) {
      await DocumentHandler.getInstance().deleteFolder(`${data.goal_id}/${id}`)
    }
    await supabase.from('projects').delete().eq('id', id)
  }

  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*, goals!inner(*)')
    if (error || !data) return []
    return data.map(p => new Project(
      p.id,
      p.name,
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
