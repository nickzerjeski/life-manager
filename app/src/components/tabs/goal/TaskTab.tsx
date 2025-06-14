import React from 'react';
import { TaskStatus } from '@/components/types/types';

interface TaskTabProps {
  client: any;
  isEditing: boolean;
}

const TaskTab: React.FC<TaskTabProps> = ({ client, isEditing }) => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold mb-2 text-gray-700">Tasks & Deadlines</h4>
    {isEditing && <p className="text-sm text-yellow-700 italic mb-2">Editing tasks is not implemented in this prototype.</p>}
    {client.tasks?.length > 0 ? (
      <ul className="space-y-2">
        {client.tasks.map((task: any) => (
          <li
            key={task.id}
            className={`p-3 border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
              task.status === TaskStatus.DONE
                ? 'bg-green-50 border-green-200'
                : task.status === TaskStatus.IN_PROGRESS
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-orange-50 border-orange-200'
            }`}
          >
            <div className="flex-grow">
              <p className={`font-medium text-sm ${task.status === TaskStatus.DONE ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</p>
              <p className="text-xs text-gray-600">Due on: {task.dueDate}</p>
            </div>
            <span
              className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                task.status === TaskStatus.DONE
                  ? 'bg-green-200 text-green-800'
                  : task.status === TaskStatus.IN_PROGRESS
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-orange-200 text-orange-800'
              }`}
            >
              {task.status === TaskStatus.DONE ? 'Done' : task.status === TaskStatus.IN_PROGRESS ? 'In Progress' : 'Open'}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic text-sm">No tasks recorded.</p>
    )}
    {isEditing && <button className="mt-2 text-sm text-blue-600 hover:underline">+ Add task (not implemented)</button>}
  </div>
);

export default TaskTab;
