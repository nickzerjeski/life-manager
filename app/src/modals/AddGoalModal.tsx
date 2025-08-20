import { useState } from 'react';
import Modal from '@/components/ui/modal';
import { Goal } from '@/models/Goal';
import { GoalHandler } from '@/models/GoalHandler';
import { AOL } from '@/models/AOL';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (goal: Goal) => void;
}

export default function AddGoalModal({ isOpen, onClose, onCreated }: AddGoalModalProps) {
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
  const [aol, setAol] = useState<AOL>(AOL.GROWTH);

  const handleCreate = async () => {
    const goal = new Goal(
      crypto.randomUUID(),
      name,
      description,
      start,
      current,
      objective,
      [new Date(periodFrom), new Date(periodTo)],
      aol,
      []
    );
    await GoalHandler.getInstance().createGoal(goal);
    if (onCreated) await onCreated(goal);
    onClose();
    setName('');
    setDescription('');
    setStart(0);
    setCurrent(0);
    setObjective(1);
    setPeriodFrom(todayStr());
    setPeriodTo(nextYearStr());
    setAol(AOL.GROWTH);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Goal">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Area of Life</label>
          <select
            value={aol}
            onChange={e => setAol(e.target.value as AOL)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {Object.values(AOL).map(val => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
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
