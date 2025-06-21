import React, { useEffect, useState } from 'react';
import { Goal } from '@/models/Goal';
import { AutomatedTask, AutomationState } from '@/models/Task';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '@/components/ui/modal';
import ChatView from '@/components/views/ChatView';
import { Chat } from '@/models/Chat';
import { Topic } from '@/models/Topic';
import { Project } from '@/models/Project';

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
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
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

  const openTask = (task: AutomatedTask) => {
    const dummyProject = new Project(
      '',
      goal.name,
      '',
      goal.start,
      goal.current,
      goal.objective,
      goal.period,
      goal,
      100,
    );
    const dummyTopic = new Topic('0', 'Task Chat', '', dummyProject);
    const chat = new Chat(task.id, task.name, task.description, [], dummyTopic);
    setActiveChat(chat);
  };


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
                onClick={() => openTask(task)}
                className={`${automationStyle[task.status]} p-3 rounded-md flex justify-between items-center gap-2 cursor-pointer`}
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

      {activeChat && (
        <Modal isOpen={!!activeChat} onClose={() => setActiveChat(null)} title={activeChat.title}>
          <ChatView chat={activeChat} goalId={goal.id} />
        </Modal>
      )}

    </div>
  );
};

export default TaskTab;
