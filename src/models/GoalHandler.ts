import { Goal } from "@/models/Goal"

/**
 * GoalHandler manages a collection of goals.
 */
export class GoalHandler {
  private goals: Goal[] = []

  /**
   * Adds a new goal to the handler.
   * @param goal Goal instance to store
   */
  createGoal(goal: Goal): void {
    this.goals.push(goal)
  }

  /**
   * Removes a goal by id.
   * @param id Identifier of the goal to delete
   */
  deleteGoal(id: number): void {
    this.goals = this.goals.filter((g) => g.id !== id)
  }

  /**
   * Returns all stored goals.
   */
  getGoals(): Goal[] {
    return this.goals
  }
}
