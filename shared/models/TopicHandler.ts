import supabase from '../db/supabase'
import { Topic } from './Topic'
import { Project } from './Project'
import { Goal } from './Goal'
import { DocumentHandler } from './DocumentHandler'

export class TopicHandler {
  private static instance: TopicHandler | null = null

  static getInstance(): TopicHandler {
    if (!TopicHandler.instance) TopicHandler.instance = new TopicHandler()
    return TopicHandler.instance
  }

  static reset(): void { TopicHandler.instance = null }

  private constructor() {}

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

  async getMarkdownForTopic(
    goalId: string,
    projectId: string,
    topicId: string
  ): Promise<string> {
    return DocumentHandler.getInstance().getMarkdown(
      `${goalId}/${projectId}/${topicId}/${topicId}.md`
    )
  }
}
