import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  FileText,
  Calendar,
  ChartNoAxesCombined,
  LucideProps,
  Tags,
} from 'lucide-react'
import { Project } from '@shared/models/Project'
import OverviewTab from '../tabs/project/OverviewTab'
import TaskTab from '../tabs/project/TaskTab'
import TopicTab from '../tabs/project/TopicTab'
import DocumentTab from '../tabs/project/DocumentTab'

interface ProjectDetailViewProps {
  project: Project
  onBack: () => void
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentProject, setCurrentProject] = useState<Project>(project)

  useEffect(() => {
    setCurrentProject(project)
    setActiveTab('overview')
  }, [project])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab project={currentProject} />
      case 'tasks':
        return <TaskTab project={currentProject} />
      case 'topics':
        return <TopicTab project={currentProject} />
      case 'documents':
        return <DocumentTab project={currentProject} />
      default:
        return null
    }
  }

  interface TabButtonProps {
    tabId: string
    label: string
    icon: React.ComponentType<LucideProps>
  }

  const TabButton: React.FC<TabButtonProps> = ({ tabId, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex flex-shrink-0 items-center px-4 py-2 text-sm font-medium rounded-md transition ${
        activeTab === tabId ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={18} className="mr-2" />
      {label}
    </button>
  )

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} aria-label="Back to Projects">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 truncate" title={project.name}>{project.name}</h2>
      </div>
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-2 overflow-x-auto whitespace-nowrap pb-2" aria-label="Tabs">
          <TabButton tabId="overview" label="Overview" icon={ChartNoAxesCombined} />
          <TabButton tabId="tasks" label="Tasks" icon={Calendar} />
          <TabButton tabId="topics" label="Topics" icon={Tags} />
          <TabButton tabId="documents" label="Documents" icon={FileText} />
        </nav>
      </div>
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  )
}

export default ProjectDetailView
