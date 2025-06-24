import { useState } from 'react'
import { GoalHandler } from '@/models/GoalHandler'
import Modal from '@/components/ui/modal'
import SetupChatView from '@/components/views/SetupChatView'

export default function HabitPage() {
  const [sessionGoalId, setSessionGoalId] = useState<string | null>(null)

  const handleClick = async () => {
    const id = crypto.randomUUID()
    await GoalHandler.getInstance().createGoalStub(id, 'test')
    setSessionGoalId(id)
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
