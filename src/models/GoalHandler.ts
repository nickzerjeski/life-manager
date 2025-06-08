import { Goal } from "@/models/Goal"

/**
 * GoalHandler manages goals persisted on the backend server.
 */
export class GoalHandler {
  private static instance: GoalHandler | null = null

  private baseUrl: string

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  static getInstance(baseUrl = 'http://localhost:3001'): GoalHandler {
    if (!GoalHandler.instance) {
      GoalHandler.instance = new GoalHandler(baseUrl)
    }
    return GoalHandler.instance
  }

  /** Reset the singleton instance (primarily for tests). */
  static reset(): void {
    GoalHandler.instance = null
  }

  /**
   * Adds a new goal to the handler.
   * @param goal Goal instance to store
   */
  async createGoal(goal: Goal): Promise<void> {
    await fetch(`${this.baseUrl}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    })
  }

  /**
   * Removes a goal by id.
   * @param id Identifier of the goal to delete
   */
  async deleteGoal(id: number): Promise<void> {
    await fetch(`${this.baseUrl}/goals/${id}`, { method: 'DELETE' })
  }

  /**
   * Removes all goals from the handler. Primarily used for tests.
   */
  async clearGoals(): Promise<void> {
    await fetch(`${this.baseUrl}/admin/clearGoals`, { method: 'POST' })
  }

  /**
   * Replace all goals with the provided list. Useful for testing.
   */
  async setGoals(goals: Goal[]): Promise<void> {
    await fetch(`${this.baseUrl}/admin/setGoals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goals),
    })
  }

  /**
   * Returns all stored goals.
   */
  async getGoals(): Promise<Goal[]> {
    const res = await fetch(`${this.baseUrl}/goals`)
    return res.json()
  }
}
