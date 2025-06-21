import React, { useEffect, useState } from 'react';
import { Goal } from '@/models/Goal';
import { AutomatedTask, AutomationState } from '@/models/Task';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TaskTabProps {
  goal: Goal;
}

const automationStyle: Record<AutomationState, string> = {
  running: 'bg-green-50 border border-green-200 animate-pulse',
  attention: 'bg-orange-50 border border-orange-200',
  not_started: 'bg-gray-50 border border-gray-200',
  failed: 'bg-red-50 border border-red-200',
};

const TaskTab: React.FC<TaskTabProps> = ({ goal }) => {
  const [tasks, setTasks] = useState<AutomatedTask[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);

  const sortTasks = (list: AutomatedTask[]) =>
    [...list].sort((a, b) => {
      const aDate = a.completedAt ?? a.deadline;
      const bDate = b.completedAt ?? b.deadline;
      return bDate.getTime() - aDate.getTime();
    });

  useEffect(() => {
    setTasks(sortTasks(goal.tasks ?? []));
  }, [goal]);


  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold mb-2 text-gray-700">Tasks</h4>
      {tasks.filter(t => !t.completedAt).length > 0 ? (
        <ul className="space-y-2">
          {tasks
            .filter(t => !t.completedAt)
            .map(task => (
              <li
                key={task.id}
                className={`${automationStyle[task.status]} p-3 rounded-md flex justify-between items-center gap-2`}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">{task.name}</p>
                  <p className="text-xs text-gray-500">
                    Duration {(task.duration / 3600).toFixed(1)}h
                  </p>
                </div>
                <StatusIndicator status={task.status} />
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">No tasks for this goal.</p>
      )}

      {tasks.some(t => t.completedAt) && (
        <div>
          <button
            type="button"
            onClick={() => setShowTimeline(v => !v)}
            className="flex items-center gap-1 mt-4"
          >
            <h5 className="text-md font-semibold text-gray-700 m-0">Finished Tasks</h5>
            {showTimeline ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showTimeline && (
            <ul className="mt-2 space-y-2">
              {tasks
                .filter(t => t.completedAt)
                .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
                .map(t => (
                  <li key={t.id} className="text-sm text-gray-600">
                    {t.name} – {t.completedAt!.toLocaleDateString()}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

    </div>
  );
};

export default TaskTab;
