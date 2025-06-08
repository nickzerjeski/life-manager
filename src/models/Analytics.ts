import { Client } from '@/data/initialClients'
import { TaskStatus } from '@/components/types/types'
import { Status } from '@/types/Status'
import { ProjectHandler } from './ProjectHandler'
import { AOL } from '@/types/AOL'
import { DeadlineItem, TaskStatusCounts, StatusCounts, AolStatusCounts } from '../types/analytics'

export class Analytics {
  static countTasksByStatus(clients: Client[]): TaskStatusCounts {
    const counts: TaskStatusCounts = {
      [TaskStatus.OPEN]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.DONE]: 0,
    }
    clients.forEach(c => c.tasks.forEach(t => { counts[t.status] += 1 }))
    return counts
  }

  static async projectsByAolAndStatus(handler: ProjectHandler): Promise<AolStatusCounts> {
    const projects = await handler.getProjects()
    const result: AolStatusCounts = {} as AolStatusCounts
    Object.values(AOL).forEach(aol => {
      result[aol] = {} as StatusCounts
      Object.values(Status).forEach(s => { result[aol][s] = 0 })
    })
    projects.forEach(p => {
      result[p.goal.aol][p.status] += 1
    })
    return result
  }

  static upcomingDeadlines(clients: Client[], limit = 5): DeadlineItem[] {
    const items: DeadlineItem[] = []
    clients.forEach(c => c.tasks.forEach(t => {
      items.push({ title: t.title, dueDate: new Date(t.dueDate) })
    }))
    return items
      .filter(i => i.dueDate.getTime() >= Date.now())
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, limit)
  }
}
