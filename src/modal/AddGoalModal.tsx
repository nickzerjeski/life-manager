import { useState } from 'react';
import Modal from '@/components/Modal';
import { Goal } from '@/models/Goal';
import { GoalHandler } from '@/models/GoalHandler';
import { Status } from '@/types/Status';
import { AOL } from '@/types/AOL';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AddGoalModal({ isOpen, onClose, onCreated }: AddGoalModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(0);
  const [stand, setStand] = useState(0);
  const [objective, setObjective] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<Status>(Status.NOT_STARTED);
  const [aol, setAol] = useState<AOL>(AOL.GROWTH);

  const handleCreate = () => {
    const goal = new Goal(
      Date.now(),
      name,
      description,
      start,
      stand,
      objective,
      [new Date(startDate), new Date(endDate)],
      status,
      aol
    );
    GoalHandler.getInstance().createGoal(goal);
    if (onCreated) onCreated();
    onClose();
    // reset fields
    setName('');
    setDescription('');
    setStart(0);
    setStand(0);
    setObjective(0);
    setStartDate('');
    setEndDate('');
    setStatus(Status.NOT_STARTED);
    setAol(AOL.GROWTH);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Goal">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="Start"
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Current"
            value={stand}
            onChange={(e) => setStand(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Objective"
            value={objective}
            onChange={(e) => setObjective(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {Object.values(Status).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={aol}
          onChange={(e) => setAol(e.target.value as AOL)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {Object.values(AOL).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
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
