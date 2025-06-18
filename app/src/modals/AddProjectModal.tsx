import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal';
import { Project } from '@/models/Project';
import { ProjectHandler } from '@/models/ProjectHandler';
import { GoalHandler } from '@/models/GoalHandler';
import { Goal } from '@/models/Goal';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
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
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(0);
  const [current, setCurrent] = useState(0);
  const [objective, setObjective] = useState(0);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().slice(0, 10);
  });
  const [goalId, setGoalId] = useState('');
  const [contributionPct, setContributionPct] = useState(0);
  useEffect(() => {
    if (goals.length > 0 && !goalId) {
      setGoalId(goals[0].id);
    }
  }, [goals, goalId]);

  const handleCreate = async () => {
    const goal = goals.find((g) => g.id === goalId) || goals[0];
    if (!goal) return;
    const project = new Project(
      Date.now().toString(),
      name,
      description,
      start,
      current,
      objective,
      [new Date(startDate), new Date(endDate)],
      goal,
      contributionPct
    );
    await ProjectHandler.getInstance(GoalHandler.getInstance()).createProject(project);
    if (onCreated) await onCreated();
    onClose();
    // reset fields
    setName('');
    setDescription('');
    setStart(0);
    setCurrent(0);
    setObjective(0);
    const today = new Date().toISOString().slice(0, 10);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const yearLater = nextYear.toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(yearLater);
    setGoalId(goals[0]?.id ?? 0);
    setContributionPct(0);
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
            <input
              type="number"
              value={start}
              onChange={(e) => setStart(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current</label>
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
            <input
              type="number"
              value={objective}
              onChange={(e) => setObjective(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goal Contribution %</label>
          <input
            type="number"
            value={contributionPct}
            onChange={(e) => setContributionPct(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
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
