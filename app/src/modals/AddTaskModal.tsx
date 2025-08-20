import React, { useEffect, useState } from 'react'
import Modal from '@/components/ui/modal'
import { Task } from '@/models/Task'
import { Project } from '@/models/Project'
import { ProjectHandler } from '@/models/ProjectHandler'
import { TaskHandler } from '@/models/TaskHandler'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: (task: Task) => void
  defaultProjectId?: string
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onCreated,
  defaultProjectId,
}: AddTaskModalProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [duration, setDuration] = useState(1)
  const [projectId, setProjectId] = useState(defaultProjectId || '')

  useEffect(() => {
    ProjectHandler.getInstance()
      .getProjects()
      .then(list => {
        setProjects(list)
        if (defaultProjectId) {
          setProjectId(defaultProjectId)
        } else if (list.length > 0 && !projectId) {
          setProjectId(list[0].id)
        }
      })
      .catch(() => setProjects([]))
  }, [defaultProjectId])

  const handleCreate = async () => {
    const project = projects.find(p => p.id === projectId) || null
    const task = new Task(
      crypto.randomUUID(),
      name,
      description,
      new Date(deadline),
      project,
      duration * 3600,
      [],
    )
    await TaskHandler.getInstance().createTask(task)
    if (onCreated) onCreated(task)
    onClose()
    setName('')
    setDescription('')
    setDeadline('')
    setDuration(1)
    setProjectId(defaultProjectId ?? projects[0]?.id ?? '')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Task">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (h)</label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      </div>
    </Modal>
  )
}
