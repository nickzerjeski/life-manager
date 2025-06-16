import supabase from '../db/supabase'
import { Topic } from './Topic'
import { Project } from './Project'
import { Goal } from './Goal'

export class TopicHandler {
  private static instance: TopicHandler | null = null

  static getInstance(): TopicHandler {
    if (!TopicHandler.instance) TopicHandler.instance = new TopicHandler()
    return TopicHandler.instance
  }

  static reset(): void { TopicHandler.instance = null }

  private constructor() {}

  async createTopic(topic: Topic): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('topics')
      .insert({
        user_id: user.id,
        project_id: topic.project.id,
        name: topic.name,
        short_description: topic.shortDescription,
      })
      .select()
      .single()

    if (data) {
      const path = `${user.id}/${topic.project.goal.id}/${topic.project.id}/${data.id}/${data.name}.md`
      const blob = new Blob([
        `# ${data.name}\n\n${data.short_description || ''}`,
      ], { type: 'text/markdown' })
      await supabase.storage.from('documents').upload(path, blob, { upsert: true })
    }
  }

  async getTopicsForProject(projectId: string): Promise<Topic[]> {
    const { data, error } = await supabase
      .from('topics')
      .select('*, projects!inner(*, goals!inner(*))')
      .eq('project_id', projectId)
    if (error || !data) return []
    return data.map(t => new Topic(
      t.id,
      t.name,
      t.short_description ?? '',
      new Project(
        t.projects.id,
        t.projects.name,
        t.projects.short_description ?? '',
        t.projects.description ?? '',
        t.projects.start,
        t.projects.current,
        t.projects.objective,
        [new Date(t.projects.period_from), new Date(t.projects.period_to)],
        new Goal(
          t.projects.goals.id,
          t.projects.goals.name,
          t.projects.goals.description,
          t.projects.goals.start,
          t.projects.goals.current,
          t.projects.goals.objective,
          [new Date(t.projects.goals.period_from), new Date(t.projects.goals.period_to)],
          t.projects.goals.area_of_life,
        ),
        t.projects.contribution_pct,
      )
    ))
  }

  async getMarkdownForTopic(topicId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return ''
    const { data } = await supabase
      .from('topics')
      .select('name, project_id, projects(goal_id)')
      .eq('id', topicId)
      .single()
    if (!data) return ''
    const path = `${user.id}/${data.projects.goal_id}/${data.project_id}/${topicId}/${data.name}.md`
    const { data: file } = await supabase.storage.from('documents').download(path)
    if (!file) return ''
    return await file.text()
  }
}
