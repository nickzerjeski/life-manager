import { useState } from 'react'
import { Goal } from '@/models/Goal'
import { GoalHandler } from '@/models/GoalHandler'
import { AOL } from '@/models/AOL'
import Modal from '@/components/ui/modal'
import SetupChatView from '@/components/views/SetupChatView'

export default function HabitPage() {
  const [sessionGoalId, setSessionGoalId] = useState<string | null>(null)

  const handleClick = async () => {
    const today = new Date()
    const goal = new Goal(
      crypto.randomUUID(),
      'test',
      '',
      0,
      0,
      0,
      [today, today],
      AOL.GROWTH,
      []
    )
    await GoalHandler.getInstance().createGoal(goal)
    setSessionGoalId(goal.id)
  }

  const closeModal = () => setSessionGoalId(null)

  return (
    <>
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Primary
      </button>
      <Modal isOpen={!!sessionGoalId} onClose={closeModal} title="">
        {sessionGoalId && <SetupChatView goalId={sessionGoalId} />}
      </Modal>
    </>
  )
}
