import { Project } from './Project'

export class Topic {
  id: number
  name: string
  shortDescription: string
  project: Project

  constructor(id: number, name: string, shortDescription: string, project: Project) {
    this.id = id
    this.name = name
    this.shortDescription = shortDescription
    this.project = project
  }
}
