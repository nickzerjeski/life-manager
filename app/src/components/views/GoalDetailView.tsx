import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Trash2,
  Edit,
  ChartNoAxesCombined,
  ListTodo,
  LucideProps,
} from 'lucide-react';
import Modal from '@/components/ui/modal';
import { SpeedDial } from '@/components/ui/speed-dial';
import ChatView from '@/components/views/ChatView';
import OverviewTab from '../tabs/goal/OverviewTab';
import ProjectTab from '../tabs/goal/ProjectTab';
import TaskTab from '../tabs/goal/TaskTab';
import DocumentTab from '../tabs/goal/DocumentTab';
import { Goal } from '@/models/Goal';
import { Badge } from '@/components/ui/badge';
import { GoalHandler } from '@/models/GoalHandler';

interface GoalDetailViewProps {
  goal: Goal;
  onBack: () => void;
  onDeleted?: () => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({
  goal,
  onBack,
  onDeleted,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editedGoal, setEditedGoal] = useState<Goal>(goal);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const attentionNeeded = editedGoal.hasAttentionTask();

  useEffect(() => {
    setEditedGoal(goal);
    setIsEditing(false);
    setActiveTab('overview');
  }, [goal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedGoal(prev => ({ ...prev, [name]: value } as Goal));
  };


  const handleSave = () => {
    // saving would persist changes to the goal
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedGoal(goal);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await GoalHandler.getInstance().deleteGoal(goal.id);
      if (onDeleted) await onDeleted();
      onBack();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const renderTabContent = () => {
    const commonProps = { goal: editedGoal };
    const documentProps = { goal: editedGoal, isEditing };
    switch (activeTab) {
      case 'overview':
        return <OverviewTab goal={editedGoal} />;
      case 'project':
        return <ProjectTab goal={editedGoal} />;
      case 'tasks':
        return <TaskTab {...commonProps} />;
      case 'documents':
        return <DocumentTab {...documentProps} />;
      default:
        return null;
    }
  };

  interface TabButtonProps {
    tabId: string;
    label: string;
    icon: React.ComponentType<LucideProps>;
    badge?: boolean;
  }

  const TabButton: React.FC<TabButtonProps> = ({ tabId, label, icon: Icon, badge }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`relative flex flex-1 flex-shrink-0 items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition ${
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
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
        <div className="flex-grow min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <button
              onClick={onBack}
              aria-label="Back to Goals"
              className="mt-2"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-800 truncate" title={goal.name}>
                {goal.name}
              </h2>
              <p className="text-sm text-gray-500 truncate">{goal.description}</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
            disabled={isEditing}
          >
            <Trash2 size={16} className="mr-1 sm:mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-2 overflow-visible whitespace-nowrap pb-2" aria-label="Tabs">
          <TabButton tabId="overview" label="Overview" icon={ChartNoAxesCombined} />
          <TabButton tabId="project" label="Projects" icon={ListTodo} />
          <TabButton tabId="tasks" label="Tasks" icon={Calendar} badge={attentionNeeded} />
          <TabButton tabId="documents" label="Documents" icon={FileText} />
        </nav>
      </div>

      <div className="mt-4">{renderTabContent()}</div>

      <SpeedDial onAskQuestion={() => setShowChat(true)} />

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm delete goal">
        <p className="mb-4">
          Are you sure you want to permanently delete the goal <strong>{goal.name}</strong>? This action cannot be undone.
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
        <ChatView goalId={goal.id} />
      </Modal>
    </div>
  );
};

export default GoalDetailView;
