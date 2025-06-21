import supabase from '../../supabase'
import { Task, ManualTask, AutomatedTask, AutomationState } from './Task'
import { Project } from './Project'
import { Goal } from './Goal'

export class TaskHandler {
  private static instance: TaskHandler | null = null

  static getInstance(): TaskHandler {
    if (!TaskHandler.instance) TaskHandler.instance = new TaskHandler()
    return TaskHandler.instance
  }

  static reset(): void { TaskHandler.instance = null }

  private constructor() {}

  async createAutomatedTaskForProject(project: Project, name: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('tasks').insert({
      user_id: user.id,
      project_id: project.id,
      name,
      is_automated: true,
      status: 'attention',
    })
  }

  async createAutomatedTaskForGoal(goal: Goal, name: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('tasks').insert({
      user_id: user.id,
      goal_id: goal.id,
      name,
      is_automated: true,
      status: 'attention',
    })
  }

  async getTasksForProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, projects!inner(goal_id, name, description, start, current, objective, period_from, period_to, contribution_pct, goals:goals(id, name, description, start, current, objective, period_from, period_to, area_of_life))')
      .eq('project_id', projectId)
    if (error || !data) return []
    return data.map(t => {
      const p = t.projects
      const g = t.projects.goals
      const project = new Project(
        p.goal_id, // id will be overwritten below after supabase fix
        p.name,
        p.description ?? '',
        p.start,
        p.current,
        p.objective,
        [new Date(p.period_from), new Date(p.period_to)],
        new Goal(
          g.id,
          g.name,
          g.description,
          g.start,
          g.current,
          g.objective,
          [new Date(g.period_from), new Date(g.period_to)],
          g.area_of_life,
        ),
        p.contribution_pct,
      )
      const common = [
        t.id,
        t.name,
        t.description ?? '',
        new Date(t.deadline),
        project,
        t.duration,
        [],
        t.completed_at ? new Date(t.completed_at) : null
      ] as [
        string,
        string,
        string,
        Date,
        Project,
        number,
        Task[],
        Date | null
      ]
      if (t.is_automated) {
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
}
