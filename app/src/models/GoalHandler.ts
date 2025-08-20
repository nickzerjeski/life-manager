import supabase from '../../supabase'
import { Goal } from './Goal'
import { DocumentHandler } from './DocumentHandler'
import { ProjectHandler } from './ProjectHandler'
import { toast } from '../hooks/use-toast'

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
    try {
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
      if (error || !inserted) throw error || new Error('Goal creation failed')
      goal.id = inserted.id
      await DocumentHandler.getInstance().uploadMarkdown(
        `${goal.id}/${goal.id}.md`,
        goal.description
      )
    } catch (err: unknown) {
      toast({
        title: 'Error creating goal',
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  async deleteGoal(id: string): Promise<void> {
    try {
      const projectHandler = ProjectHandler.getInstance()
      const projects = await projectHandler.getProjectsForGoal(id)
      await Promise.all(projects.map(p => projectHandler.deleteProject(p.id)))
      await DocumentHandler.getInstance().deleteFolder(`${id}`)
      const { error } = await supabase.from('goals').delete().eq('id', id)
      if (error) throw error
    } catch (err: unknown) {
      toast({
        title: 'Error deleting goal',
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  async getGoals(): Promise<Goal[]> {
    try {
      const { data, error } = await supabase.from('goals').select('*')
      if (error || !data) throw error || new Error('Failed to load goals')
      return data.map(g => new Goal(
        g.id,
        g.name,
        g.description,
        g.start,
        g.current,
        g.objective,
        [new Date(g.period_from), new Date(g.period_to)],
        g.area_of_life,
      ))
    } catch (err: unknown) {
      toast({
        title: 'Error fetching goals',
        description: err instanceof Error ? err.message : 'Unknown error',
      })
      return []
    }
  }
}
