import { useState } from 'react'
import { useStore } from '../domain/store'
import type { Goal } from '../domain/types'

export default function GoalList() {
  const { goals, addGoal } = useStore()
  const [name, setName] = useState('')

  const handleAdd = () => {
    if (!name) return
    const goal: Goal = {
      id: Math.random().toString(36).slice(2),
      name,
      period: { from: new Date().toISOString(), to: new Date().toISOString() },
      status: 'Not started',
      areaOfLife: 'General',
      projects: [],
    }
    addGoal(goal)
    setName('')
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Goals</h2>
      <ul className="mb-4">
        {goals.map((g) => (
          <li key={g.id} className="border p-2 mb-2 rounded">
            {g.name} - {g.status}
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
