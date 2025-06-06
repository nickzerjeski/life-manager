import React from 'react';
import { formatDate } from './helpers';
import { TaskStatus } from "@/components/types/types";

const TaskOverview = ({ tasks, onSelectTask }) => {
  return (
    <div>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} 
              onClick={() => onSelectTask?.(task)} 
              className={`p-3 border rounded-md flex flex-col 
                          sm:flex-row justify-between items-start sm:items-center 
                          gap-2 cursor-pointer transition-shadow hover:shadow-md 
                          ${task.status === TaskStatus.DONE
                            ? 'bg-green-50 border-green-200'
                            : task.status === TaskStatus.IN_PROGRESS
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-orange-50 border-orange-200'}`}>
            <div className="flex-grow">
              <p className={`font-medium text-sm ${task.status === TaskStatus.DONE ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </p>
              <p className="text-xs text-gray-500">
                Klient: {task.client.firstName} {task.client.lastName}
              </p>
              <p className="text-xs text-gray-600">Fällig am: {formatDate(task.dueDate)}</p>
            </div>
            <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full 
                            ${task.status === TaskStatus.DONE
                              ? 'bg-green-200 text-green-800'
                              : task.status === TaskStatus.IN_PROGRESS
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-orange-200 text-orange-800'}`}>
              {task.status === TaskStatus.DONE ? 'Erledigt' : task.status === TaskStatus.IN_PROGRESS ? 'In Bearbeitung' : 'Offen'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskOverview;