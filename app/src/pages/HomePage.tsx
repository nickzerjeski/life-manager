import React, { useEffect, useState } from 'react'
import { Task, AutomatedTask } from '@/models/Task'
import { TaskHandler } from '@/models/TaskHandler'
import AddTaskModal from '@/modals/AddTaskModal'
import { manualTaskStyle, automationTaskStyle } from '@/styles/taskStyles'

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showModal, setShowModal] = useState(false)
  const handler = React.useMemo(() => TaskHandler.getInstance(), [])

  useEffect(() => {
    handler
      .getTasks()
      .then(setTasks)
      .catch(() => setTasks([]))
  }, [handler])

  return (
    <section className="space-y-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-2">
        <h1 className="text-2xl font-bold">Welcome to LifeManager</h1>
        <p className="text-gray-700">
          Manage your habits, projects and goals from a single dashboard.
        </p>
      </div>

      <div className="bg-white shadow rounded p-4 text-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tasks</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map(t => (
              <li
                key={t.id}
                className={`${
                  t instanceof AutomatedTask
                    ? automationTaskStyle[t.status]
                    : manualTaskStyle
                } p-3 rounded-md`}
              >
                <p className="font-medium text-sm text-gray-800">{t.name}</p>
                {t.description && (
                  <p className="text-xs text-gray-600">{t.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  Duration {(t.duration / 3600).toFixed(1)}h •
                  {' '}
                  {t.deadline.toLocaleDateString()}
                  {t.project && ` • ${t.project.name}`}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-sm">No tasks yet.</p>
        )}
      </div>

      <AddTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={task => setTasks(prev => [...prev, task])}
      />
    </section>
  )
}
