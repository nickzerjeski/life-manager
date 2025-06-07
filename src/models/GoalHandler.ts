import { Goal } from "@/models/Goal"
import { Status } from "@/types/Status"
import { AOL } from "@/types/AOL"

/**
 * GoalHandler manages a collection of goals.
 */
export class GoalHandler {
  private static instance: GoalHandler | null = null

  private goals: Goal[] = []

  private constructor() {
    this.goals = [
      new Goal(
        1,
        'Projektplanung abschließen',
        'Detaillierte Schritte und Meilensteine festlegen',
        0,
        20,
        100,
        [new Date('2025-06-01'), new Date('2025-09-30')],
        Status.ON_TRACK,
        AOL.PURPOSE
      ),
      new Goal(
        2,
        'MVP-Implementierung starten',
        'Kernfunktionalität entwickeln und testen',
        0,
        10,
        100,
        [new Date('2025-06-15'), new Date('2025-10-15')],
        Status.AT_RISK,
        AOL.GROWTH
      ),
      new Goal(
        3,
        'Markteinführung vorbereiten',
        'Marketing-Kampagne und Dokumentation erstellen',
        0,
        0,
        100,
        [new Date('2025-07-01'), new Date('2025-11-01')],
        Status.OFF_TRACK,
        AOL.FINANCES
      ),
    ]
  }

  static getInstance(): GoalHandler {
    if (!GoalHandler.instance) {
      GoalHandler.instance = new GoalHandler()
    }
    return GoalHandler.instance
  }

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
   * Removes all goals from the handler. Primarily used for tests.
   */
  clearGoals(): void {
    this.goals = []
  }

  /**
   * Replace all goals with the provided list. Useful for testing.
   */
  setGoals(goals: Goal[]): void {
    this.goals = goals
  }

  /**
   * Returns all stored goals.
   */
  getGoals(): Goal[] {
    return this.goals
  }
}
