import { useState } from 'react'
import { useStore } from '../domain/store'
import type { Task } from '../domain/types'

interface Props {
  projectId: string
}

export default function TaskList({ projectId }: Props) {
  const { goals, addTask } = useStore()
  const project = goals.flatMap((g) => g.projects).find((p) => p.id === projectId)
  const [name, setName] = useState('')

  if (!project) return null

  const handleAdd = () => {
    if (!name) return
    const task: Task = {
      id: Math.random().toString(36).slice(2),
      name,
      description: '',
      duration: 60,
      priority: 3,
      dependencyIds: [],
      completed: false,
    }
    addTask(projectId, task)
    setName('')
  }

  return (
    <div className="p-4 border rounded mt-2">
      <h4 className="font-semibold mb-2">Tasks for {project.name}</h4>
      <ul className="mb-2">
        {project.tasks.map((t) => (
          <li key={t.id} className="border p-1 mb-1 rounded">
            {t.name} {t.completed ? '(done)' : ''}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          className="border p-1 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New task name"
        />
        <button className="bg-blue-500 text-white px-3" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  )
}
