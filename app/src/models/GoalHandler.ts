import supabase from '../../supabase'
import { Goal } from './Goal'
import { DocumentHandler } from './DocumentHandler'
import { MOCK_MARKDOWN } from '../utils/mockMarkdown'
import { ProjectHandler } from './ProjectHandler'

export class GoalHandler {
  private static instance: GoalHandler | null = null

  static getInstance(): GoalHandler {
    if (!GoalHandler.instance) GoalHandler.instance = new GoalHandler()
    return GoalHandler.instance
  }

  static reset(): void {
    GoalHandler.instance = null
  }

  private constructor() {}

  async createGoal(goal: Goal): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: inserted, error } = await supabase
      .from('goals')
      .insert({
      user_id: user.id,
      name: goal.name,
      description: goal.description,
      start: goal.start,
      current: goal.current,
      objective: goal.objective,
      period_from: goal.period[0].toISOString().slice(0,10),
      period_to: goal.period[1].toISOString().slice(0,10),
      status: goal.status,
      area_of_life: goal.aol,
      })
      .select()
      .single()
    if (error || !inserted) return
    goal.id = inserted.id
    await DocumentHandler.getInstance().uploadMarkdown(
      `${goal.id}/${goal.id}.md`,
      MOCK_MARKDOWN
    )
  }

  async deleteGoal(id: string): Promise<void> {
    const projectHandler = ProjectHandler.getInstance()
    const projects = await projectHandler.getProjectsForGoal(id)
    await Promise.all(projects.map(p => projectHandler.deleteProject(p.id)))
    await DocumentHandler.getInstance().deleteFolder(`${id}`)
    await supabase.from('goals').delete().eq('id', id)
  }

  async getGoals(): Promise<Goal[]> {
    const { data } = await supabase.from('goals').select('*')
    return (data || []).map(g => new Goal(
      g.id,
      g.name,
      g.description,
      g.start,
      g.current,
      g.objective,
      [new Date(g.period_from), new Date(g.period_to)],
      g.area_of_life,
    ))
  }
}
