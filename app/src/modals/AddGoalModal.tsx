import { useState } from 'react';
import Modal from '@/components/ui/modal';
import { Goal } from '@/models/Goal';
import { GoalHandler } from '@/models/GoalHandler';
import { AOL } from '@/models/AOL';
import { AutomatedTask } from '@/models/Task';
import { TaskHandler } from '@/models/TaskHandler';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (goal: Goal) => void;
}

export default function AddGoalModal({ isOpen, onClose, onCreated }: AddGoalModalProps) {
  const [name, setName] = useState('');

  const handleCreate = async () => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    const task = new AutomatedTask(
      crypto.randomUUID(),
      'setup goal',
      '',
      today,
      null,
      0,
      'attention'
    );
    const goal = new Goal(
      Date.now().toString(),
      name,
      '',
      0,
      0,
      1,
      [today, nextYear],
      AOL.GROWTH,
      [task]
    );
    await GoalHandler.getInstance().createGoal(goal);
    await TaskHandler.getInstance().createAutomatedTaskForGoal(goal, 'setup goal');
    if (onCreated) await onCreated(goal);
    onClose();
    setName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Goal">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Goal
          </button>
        </div>
      </div>
    </Modal>
  );
}
