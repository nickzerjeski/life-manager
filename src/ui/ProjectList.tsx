import { useState } from 'react'
import { useStore } from '../domain/store'
import type { Project } from '../domain/types'

interface Props {
  goalId: string
}

export default function ProjectList({ goalId }: Props) {
  const { goals, addProject } = useStore()
  const goal = goals.find((g) => g.id === goalId)
  const [name, setName] = useState('')

  if (!goal) return null

  const handleAdd = () => {
    if (!name) return
    const project: Project = {
      id: Math.random().toString(36).slice(2),
      goalId,
      name,
      period: { from: new Date().toISOString(), to: new Date().toISOString() },
      status: 'Not started',
      tasks: [],
    }
    addProject(goalId, project)
    setName('')
  }

  return (
    <div className="p-4 border rounded mt-2">
      <h3 className="font-semibold mb-2">Projects for {goal.name}</h3>
      <ul className="mb-2">
        {goal.projects.map((p) => (
          <li key={p.id} className="border p-1 mb-1 rounded">
            {p.name} - {p.status}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          className="border p-1 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
        />
        <button className="bg-blue-500 text-white px-3" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  )
}
