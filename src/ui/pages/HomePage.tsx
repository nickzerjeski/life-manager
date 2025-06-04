import { useStore } from '../../domain/store'
import { useState } from 'react'

export default function HomePage() {
  const tasks = useStore((s) =>
    s.goals.flatMap((g) => g.projects.flatMap((p) => p.tasks))
  )
  const [view, setView] = useState<'day' | 'week' | 'month'>('month')

  const grouped = tasks.reduce<Record<string, typeof tasks>>((acc, t) => {
    acc[t.date] = acc[t.date] ? [...acc[t.date], t] : [t]
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Calendar</h2>
      <div className="flex gap-2">
        {(['day', 'week', 'month'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${view === v ? 'opacity-80' : ''}`}
          >
            {v}
          </button>
        ))}
      </div>
      {Object.keys(grouped).map((d) => (
        <div key={d} className="bg-white shadow rounded p-4 text-gray-800">
          <div className="font-semibold mb-2">{d}</div>
          <ul className="list-disc ml-4">
            {grouped[d].map((t) => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
