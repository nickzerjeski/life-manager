import supabase from '../db/supabase'
import { Goal } from './Goal'

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
    const { data } = await supabase
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

    if (data) {
      const path = `${user.id}/${data.id}/${data.name}.md`
      const blob = new Blob([
        `# ${data.name}\n\n${data.description || ''}`,
      ], { type: 'text/markdown' })
      await supabase.storage.from('documents').upload(path, blob, { upsert: true })
    }
  }

  async deleteGoal(id: string): Promise<void> {
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
