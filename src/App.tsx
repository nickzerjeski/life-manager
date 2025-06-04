import GoalList from './ui/GoalList'
import ProjectList from './ui/ProjectList'
import TaskList from './ui/TaskList'
import { useStore } from './domain/store'
import './App.css'

export default function App() {
  const { goals } = useStore()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">LifeManager</h1>
      <GoalList />
      {goals.map((g) => (
        <div key={g.id} className="ml-4">
          <ProjectList goalId={g.id} />
          {g.projects.map((p) => (
            <div key={p.id} className="ml-4">
              <TaskList projectId={p.id} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
