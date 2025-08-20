import React, { useEffect, useState } from 'react'
import { Project } from '@/models/Project'
import { Task, ManualTask, AutomatedTask, AutomationState } from '@/models/Task'
import { TaskHandler } from '@/models/TaskHandler'
import { Check, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { Timeline } from '@/components/ui/timeline'
import { StatusIndicator } from '@/components/ui/status-indicator'
import Modal from '@/components/ui/modal'
import ChatView from '@/components/views/ChatView'
import { Chat } from '@/models/Chat'
import { Topic } from '@/models/Topic'
import AddTaskModal from '@/modals/AddTaskModal'

const manualStyle = 'bg-blue-50 border border-blue-200'
const automationStyle: Record<AutomationState, string> = {
  running: 'bg-green-50 border border-green-200 animate-pulse',
  attention: 'bg-orange-50 border border-orange-200',
  not_started: 'bg-gray-50 border border-gray-200',
  failed: 'bg-red-50 border border-red-200',
}

interface TaskTabProps {
  project: Project
}

const TaskTab: React.FC<TaskTabProps> = ({ project }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const handler = React.useMemo(() => TaskHandler.getInstance(), [])

  const sortTasks = (list: Task[]) =>
    [...list].sort((a, b) => {
      const aDate = a.completedAt ?? a.deadline
      const bDate = b.completedAt ?? b.deadline
      return bDate.getTime() - aDate.getTime()
    })

  useEffect(() => {
    handler
      .getTasksForProject(project.id)
      .then(list => setTasks(sortTasks(list)))
      .catch(() => setTasks([]))
  }, [project.id, handler])

  const addTask = (task: Task) => {
    setTasks(prev => sortTasks([...prev, task]))
  }

  const completeTask = (task: Task) => {
    if (task.completedAt) return
    const updated = tasks.map(t =>
      t.id === task.id ? { ...t, completedAt: new Date() } : t
    )
    setTasks(sortTasks(updated))
  }

  const openTask = (task: Task) => {
    const dummyTopic = new Topic(0, 'Task Chat', '', project)
    const chat = new Chat(task.id, task.name, task.description, [], dummyTopic)
    setActiveChat(chat)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Tasks</h4>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
        >
          <Plus size={16} className="mr-1 sm:mr-2" /> Add Task
        </button>
      </div>
      {tasks.filter(t => !t.completedAt).length > 0 ? (
        <ul className="space-y-2">
          {tasks
            .filter(t => !t.completedAt)
            .map(task => (
            <li
              key={task.id}
              onClick={() => openTask(task)}
              className={`${
                task instanceof AutomatedTask
                  ? automationStyle[task.status]
                  : manualStyle
              } p-3 rounded-md flex justify-between items-center gap-2 cursor-pointer`}
            >
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">{task.name}</p>
                {task.completedAt && !(task instanceof ManualTask) && (
                  <p className="text-xs text-gray-600">{task.description}</p>
                )}
                <p className="text-xs text-gray-500">Duration {(task.duration / 3600).toFixed(1)}h</p>
              </div>
              <div className="flex gap-2 items-center">
                {task instanceof ManualTask && !task.completedAt && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      completeTask(task)
                    }}
                    className="p-1 rounded-full border-2 border-blue-600 bg-blue-300 text-white hover:bg-blue-600"
                  >
                    <Check size={16} />
                  </button>
                )}
                {task instanceof ManualTask && task.completedAt && (
                  <Check size={16} className="text-green-600" />
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
          <button
            type="button"
            onClick={() => setShowTimeline(v => !v)}
            className="flex items-center gap-1 mt-4"
          >
            <h5 className="text-md font-semibold text-gray-700 m-0">Finished Tasks</h5>
            {showTimeline ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showTimeline && (
            <Timeline
              entries={tasks
                .filter(t => t.completedAt)
                .sort((a, b) =>
                  b.completedAt!.getTime() - a.completedAt!.getTime()
                )
                .map(t => ({
                  title: t.name,
                  description: t.description,
                  date: t.completedAt!.toLocaleDateString(),
                }))}
            />
          )}
        </div>
      )}

      {activeChat && (
        <Modal isOpen={!!activeChat} onClose={() => setActiveChat(null)} title={activeChat.title}>
          <ChatView chat={activeChat} projectId={project.id} />
        </Modal>
      )}

      <AddTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={addTask}
        defaultProjectId={project.id}
      />
    </div>
  )
}

export default TaskTab
