import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal';
import { Project } from '@/models/Project';
import { ProjectHandler } from '@/models/ProjectHandler';
import { GoalHandler } from '@/models/GoalHandler';
import { Goal } from '@/models/Goal';
import { AutomatedTask } from '@/models/Task';
import { TaskHandler } from '@/models/TaskHandler';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (project: Project) => void;
}

export default function AddProjectModal({ isOpen, onClose, onCreated }: AddProjectModalProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  useEffect(() => {
    GoalHandler.getInstance()
      .getGoals()
      .then(setGoals)
      .catch(() => setGoals([]));
  }, []);
  const [name, setName] = useState('');
  const [goalId, setGoalId] = useState('');
  useEffect(() => {
    if (goals.length > 0 && !goalId) {
      setGoalId(goals[0].id);
    }
  }, [goals, goalId]);

  const handleCreate = async () => {
    const goal = goals.find((g) => g.id === goalId) || goals[0];
    if (!goal) return;
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    const project = new Project(
      Date.now().toString(),
      name,
      '',
      0,
      0,
      1,
      [today, nextYear],
      goal,
      0
    );
    await ProjectHandler.getInstance(GoalHandler.getInstance()).createProject(project);
    await TaskHandler.getInstance().createAutomatedTaskForProject(project, 'setup project');
    if (onCreated) await onCreated(project);
    onClose();
    setName('');
    setGoalId(goals[0]?.id ?? '');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Project">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
          <select
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>
      </div>
    </Modal>
  );
}
