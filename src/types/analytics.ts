import { AOL } from './AOL'
import { Status } from './Status'
import { TaskStatus } from '@/components/types/types'

export interface TaskStatusCounts {
  [TaskStatus.OPEN]: number
  [TaskStatus.IN_PROGRESS]: number
  [TaskStatus.DONE]: number
}

export interface StatusCounts {
  [key in Status]: number
}

export interface AolStatusCounts {
  [key in AOL]: StatusCounts
}

export interface DeadlineItem {
  title: string
  dueDate: Date
}
