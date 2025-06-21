import { Project } from './Project'
import { DocumentHandler } from './DocumentHandler'

export class Topic {
  id: string
  name: string
  shortDescription: string
  project: Project

  constructor(id: string, name: string, shortDescription: string, project: Project) {
    this.id = id
    this.name = name
    this.shortDescription = shortDescription
    this.project = project
  }

  /**
   * Loads the topic's markdown note.
   */
  async getOverview(): Promise<string> {
    const res = await DocumentHandler.getInstance().getDocument(
      `${this.project.goal.id}/${this.project.id}/${this.id}/${this.id}.md`
    )
    return res.content || ''
  }
}
