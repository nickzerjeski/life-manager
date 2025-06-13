import React, { useEffect, useState } from 'react'
import { Project } from '@shared/models/Project'
import { Task, ManualTask, AutomatedTask } from '@shared/models/Task'
import { TaskHandler } from '@shared/models/TaskHandler'
import { Sparkles } from 'lucide-react'
import { Timeline } from '@/components/ui/timeline'
import { StatusIndicator } from '@/components/ui/status-indicator'

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
                <p className="font-medium text-sm text-gray-800">{task.name}</p>
                <p className="text-xs text-gray-600">{task.description}</p>
                <p className="text-xs text-gray-600">Due {task.deadline.toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">Duration {(task.duration / 3600).toFixed(1)}h</p>
              </div>
              <div className="flex gap-2 items-center">
                {task instanceof ManualTask && (
                  <button
                    type="button"
                    className="p-1 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Sparkles size={16} />
                  </button>
                )}
                {task instanceof AutomatedTask && (
                  <StatusIndicator status={task.status} />
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">No tasks for this project.</p>
      )}

      {tasks.some(t => t.completedAt) && (
        <div>
          <h5 className="text-md font-semibold text-gray-700 mt-4">Timeline</h5>
          <Timeline
            entries={tasks
              .filter(t => t.completedAt)
              .map(t => ({
                title: t.name,
                description: t.description,
                date: t.completedAt!.toLocaleDateString(),
              }))}
          />
        </div>
      )}
    </div>
  )
}

export default TaskTab
