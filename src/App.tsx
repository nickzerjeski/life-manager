import { useState } from 'react'
import Header from './ui/components/Header'
import Sidebar from './ui/components/Sidebar'
import HomePage from './ui/pages/HomePage'
import GoalsPage from './ui/pages/GoalsPage'
import ProjectsPage from './ui/pages/ProjectsPage'
import HabitsPage from './ui/pages/HabitsPage'
import { useNavStore } from './domain/navigation'
import './App.css'

export default function App() {
  const { page } = useNavStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const handleNavigate = () => setSidebarOpen(false)

  let content
  if (page === 'Home') content = <HomePage />
  if (page === 'Goals') content = <GoalsPage />
  if (page === 'Projects') content = <ProjectsPage />
  if (page === 'Habits') content = <HabitsPage />

  return (
    <div className="h-screen flex">
      <Sidebar open={sidebarOpen} onNavigate={handleNavigate} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenu={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 overflow-auto flex-1 bg-gray-50">{content}</main>
      </div>
    </div>
  )
}
