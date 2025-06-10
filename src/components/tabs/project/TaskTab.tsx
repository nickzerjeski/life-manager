import React, { useEffect, useState } from 'react'
import { Project } from '@/models/Project'
import { Task } from '@/models/Task'
import { TaskHandler } from '@/models/TaskHandler'
import { Sparkles } from 'lucide-react'

interface TaskTabProps {
  project: Project
}

const TaskTab: React.FC<TaskTabProps> = ({ project }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const handler = React.useMemo(() => TaskHandler.getInstance(), [])

  useEffect(() => {
    handler
      .getTasksForProject(project.id)
      .then(setTasks)
      .catch(() => setTasks([]))
  }, [project.id, handler])

  const generate = async () => {
    try {
      const generated = await handler.generateTasks(project.id)
      setTasks(prev => [...prev, ...generated])
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Tasks</h4>
        <button
          onClick={generate}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
        >
          <Sparkles size={16} className="mr-1 sm:mr-2" /> Generate Tasks
        </button>
      </div>
      {tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li
              key={task.id}
              className="bg-blue-50 border border-blue-200 p-3 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            >
              <div>
                <p className="font-medium text-sm text-gray-800">{task.description}</p>
                <p className="text-xs text-gray-600">Due {task.deadline.toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">Duration {(task.duration / 3600).toFixed(1)}h</p>
              </div>
              <span className="bg-blue-200 text-blue-800 flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full">
                {task.project.name}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">No tasks for this project.</p>
      )}
    </div>
  )
}

export default TaskTab
