import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal';
import { Project } from '@/models/Project';
import { ProjectHandler } from '@/models/ProjectHandler';
import { GoalHandler } from '@/models/GoalHandler';
import { Goal } from '@/models/Goal';

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
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(0);
  const [current, setCurrent] = useState(0);
  const [objective, setObjective] = useState(1);
  const todayStr = () => new Date().toISOString().split('T')[0];
  const nextYearStr = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  };
  const [periodFrom, setPeriodFrom] = useState(todayStr());
  const [periodTo, setPeriodTo] = useState(nextYearStr());
  const [contributionPct, setContributionPct] = useState(0);
  const [goalId, setGoalId] = useState('');
  useEffect(() => {
    if (goals.length > 0 && !goalId) {
      setGoalId(goals[0].id);
    }
  }, [goals, goalId]);

  const handleCreate = async () => {
    const goal = goals.find(g => g.id === goalId) || goals[0];
    if (!goal) return;
    const project = new Project(
      crypto.randomUUID(),
      name,
      description,
      start,
      current,
      objective,
      [new Date(periodFrom), new Date(periodTo)],
      goal,
      contributionPct,
    );
    await ProjectHandler.getInstance().createProject(project);
    if (onCreated) await onCreated(project);
    onClose();
    setName('');
    setDescription('');
    setStart(0);
    setCurrent(0);
    setObjective(1);
    setPeriodFrom(todayStr());
    setPeriodTo(nextYearStr());
    setContributionPct(0);
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
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
            <input
              type="number"
              value={start}
              onChange={e => setStart(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current</label>
            <input
              type="number"
              value={current}
              onChange={e => setCurrent(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
            <input
              type="number"
              value={objective}
              onChange={e => setObjective(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={periodFrom}
              onChange={e => setPeriodFrom(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={periodTo}
              onChange={e => setPeriodTo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contribution %</label>
          <input
            type="number"
            value={contributionPct}
            onChange={e => setContributionPct(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
          <select
            value={goalId}
            onChange={e => setGoalId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {goals.map(g => (
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
            Add Project
          </button>
        </div>
      </div>
    </Modal>
  );
}
