import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  FileText,
  Calendar,
  ChartNoAxesCombined,
  LucideProps,
  Tags,
  Trash2,
} from 'lucide-react'
import { Project } from '@/models/Project'
import { ProjectHandler } from '@/models/ProjectHandler'
import OverviewTab from '../tabs/project/OverviewTab'
import TaskTab from '../tabs/project/TaskTab'
import TopicTab from '../tabs/project/TopicTab'
import DocumentTab from '../tabs/project/DocumentTab'
import Modal from '@/components/ui/modal'
import { SpeedDial } from '@/components/ui/speed-dial'
import ChatView from '@/components/views/ChatView'
import { Badge } from '@/components/ui/badge'

interface ProjectDetailViewProps {
  project: Project
  onBack: () => void
  onDeleted?: () => void
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onDeleted,
}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentProject, setCurrentProject] = useState<Project>(project)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [attentionNeeded, setAttentionNeeded] = useState(false)

  const handleDelete = async () => {
    try {
      await ProjectHandler.getInstance().deleteProject(currentProject.id)
      if (onDeleted) await onDeleted()
      onBack()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setShowDeleteConfirm(false)
    }
  }

  useEffect(() => {
    setCurrentProject(project)
    setActiveTab('overview')
    project.hasAttentionTask()
      .then(setAttentionNeeded)
      .catch(() => setAttentionNeeded(false))
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
    badge?: boolean
  }

  const TabButton: React.FC<TabButtonProps> = ({ tabId, label, icon: Icon, badge }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`relative flex flex-shrink-0 sm:flex-1 items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition ${
        activeTab === tabId
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={18} className="mr-2" />
      {label}
      {badge && (
        <Badge
          variant="destructive"
          className="pointer-events-none absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center rounded-full p-0"
        >
          !
        </Badge>
      )}
    </button>
  )

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
        <div className="flex items-center gap-2 flex-grow min-w-0">
          <button onClick={onBack} aria-label="Back to Projects" className="mt-2">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 truncate" title={project.name}>{project.name}</h2>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
        >
          <Trash2 size={16} className="mr-1 sm:mr-2" /> Delete
        </button>
      </div>
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-2 overflow-x-auto whitespace-nowrap pb-2" aria-label="Tabs">
          <TabButton tabId="overview" label="Overview" icon={ChartNoAxesCombined} />
          <TabButton tabId="tasks" label="Tasks" icon={Calendar} badge={attentionNeeded} />
          <TabButton tabId="topics" label="Topics" icon={Tags} />
          <TabButton tabId="documents" label="Documents" icon={FileText} />
        </nav>
      </div>
      <div className="mt-4">{renderTabContent()}</div>

      <SpeedDial onAskQuestion={() => setShowChat(true)} />
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm delete project"
      >
        <p className="mb-4">
          Are you sure you want to permanently delete the project{' '}
          <strong>{project.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
          >
            Confirm Delete
          </button>
        </div>
      </Modal>

      <Modal isOpen={showChat} onClose={() => setShowChat(false)} title="Ask a question">
        <ChatView projectId={project.id} />
      </Modal>
    </div>
  )
}

export default ProjectDetailView

