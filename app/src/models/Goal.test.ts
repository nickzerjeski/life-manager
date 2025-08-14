import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest'

vi.mock('./DocumentHandler', () => ({
  DocumentHandler: { getInstance: () => ({ getDocument: vi.fn() }) }
}))

import { Goal } from './Goal'
import { AOL } from './AOL'
import { Status } from './Status'
import { AutomatedTask } from './Task'

const startDate = new Date('2024-01-01')
const endDate = new Date('2024-01-11')

function createGoal(current: number, tasks: AutomatedTask[] = []) {
  return new Goal('1', 'Test', 'desc', 0, current, 100, [startDate, endDate], AOL.GROWTH, tasks)
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2024-01-06'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Goal metrics', () => {
  test('calculates progress and time correctly', () => {
    const goal = createGoal(50)
    expect(goal.progressPercentage).toBe(50)
    expect(goal.totalDays).toBe(10)
    expect(goal.daysElapsed).toBe(5)
    expect(goal.daysRemaining).toBe(5)
    expect(goal.timePercentage).toBe(50)
  })
})

describe('Goal status', () => {
  test('determines status based on progress and time', () => {
    expect(createGoal(60).status).toBe(Status.ON_TRACK)
    expect(createGoal(47).status).toBe(Status.AT_RISK)
    expect(createGoal(40).status).toBe(Status.OFF_TRACK)
    expect(createGoal(100).status).toBe(Status.ACHIEVED)
    vi.setSystemTime(new Date('2023-12-30'))
    expect(createGoal(0).status).toBe(Status.NOT_STARTED)
  })
})

describe('Goal tasks', () => {
  test('hasAttentionTask detects active attention tasks', () => {
    const task = new AutomatedTask('t1', 'Task', '', new Date(), null, 0, 'attention')
    const goal = createGoal(0, [task])
    expect(goal.hasAttentionTask()).toBe(true)
  })
})
