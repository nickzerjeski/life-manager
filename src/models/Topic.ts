import { Project } from './Project'

export class Topic {
  id: number
  name: string
  project: Project

  constructor(id: number, name: string, project: Project) {
    this.id = id
    this.name = name
    this.project = project
  }
}
