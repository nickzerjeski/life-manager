import { useState } from 'react'
import { useStore } from '../domain/store'
import type { Goal, Project, Task } from '../domain/types'

export default function GoalList() {
  const { goals, addGoal, removeGoal } = useStore()
  const [name, setName] = useState('')

  const handleAdd = () => {
    if (!name) return
    const id = Math.random().toString(36).slice(2)
    const task: Task = {
      id: Math.random().toString(36).slice(2),
      name: 'Sample Task',
      description: '',
      duration: 60,
      priority: 3,
      dependencyIds: [],
      completed: false,
      date: new Date().toISOString().slice(0, 10),
    }
    const project: Project = {
      id: Math.random().toString(36).slice(2),
      goalId: id,
      name: 'Sample Project',
      period: { from: new Date().toISOString(), to: new Date().toISOString() },
      status: 'Not started',
      tasks: [task],
    }
    const goal: Goal = {
      id,
      name,
      period: { from: new Date().toISOString(), to: new Date().toISOString() },
      status: 'Not started',
      areaOfLife: 'General',
      projects: [project],
    }
    addGoal(goal)
    setName('')
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Goals</h2>
      <ul className="mb-4">
        {goals.map((g) => (
          <li key={g.id} className="border p-2 mb-2 rounded flex justify-between items-center">
            <span>
              {g.name} - {g.status}
            </span>
            <button
              onClick={() => removeGoal(g.id)}
              className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          className="border p-1 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New goal name"
        />
        <button className="bg-blue-500 text-white px-3" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  )
}
