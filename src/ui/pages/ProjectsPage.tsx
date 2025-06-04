import { useStore } from '../../domain/store'

export default function ProjectsPage() {
  const projects = useStore((s) =>
    s.goals.flatMap((g) => g.projects.map((p) => ({ ...p, goalName: g.name })))
  )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Projects</h2>
      {projects.map((p) => (
        <div key={p.id} className="bg-white shadow rounded p-4 text-gray-800">
          <div className="font-semibold">{p.name}</div>
          <div className="text-sm text-gray-500">Goal: {p.goalName}</div>
        </div>
      ))}
    </div>
  )
}
