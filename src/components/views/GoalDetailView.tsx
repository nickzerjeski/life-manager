import React, { useState, useEffect } from 'react';
import { User, Heart, Calendar, FileText, Trash2, Edit, ChartNoAxesCombined, ListTodo, LucideProps } from 'lucide-react';
import Modal from '@/components/ui/modal';
import GoalOverviewTab from '../tabs/goal/GoalOverviewTab';
import ProjectTab from '../tabs/goal/ProjectTab';
import TaskTab from '../tabs/goal/TaskTab';
import DocumentTab from '../tabs/goal/DocumentTab';

interface GoalDetailViewProps {
  goal: any;
  onBack: () => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({ goal, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editedGoal, setEditedGoal] = useState<any>(goal);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setEditedGoal(goal);
    setIsEditing(false);
    setActiveTab('overview');
  }, [goal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedGoal((prev: any) => ({ ...prev, [name]: value }));
  };


  const handleSave = () => {
    // saving would persist changes to the goal
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedGoal(goal);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
  };

  const renderTabContent = () => {
    const commonProps = { client: editedGoal, isEditing, onChange: handleInputChange };
    switch (activeTab) {
      case 'overview':
        return <GoalOverviewTab goal={editedGoal} />;
      case 'project':
        return <ProjectTab {...commonProps} />;
      case 'tasks':
        return <TaskTab {...commonProps} />;
      case 'documents':
        return <DocumentTab {...commonProps} />;
      default:
        return null;
    }
  };

  interface TabButtonProps {
    tabId: string;
    label: string;
    icon: React.ComponentType<LucideProps>;
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
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Back to Goals
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
        <div className="flex-grow min-w-0">
          <h2 className="text-2xl font-bold text-gray-800 truncate" title={goal.name}>
            {goal.name}
          </h2>
          <p className="text-sm text-gray-500 truncate">{goal.description}</p>
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
            >
              <Edit size={16} className="mr-1 sm:mr-2" /> Bearbeiten
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
              >
                Speichern
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
              >
                Abbrechen
              </button>
            </>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
            disabled={isEditing}
          >
            <Trash2 size={16} className="mr-1 sm:mr-2" /> Löschen
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-2 overflow-x-auto whitespace-nowrap pb-2" aria-label="Tabs">
          <TabButton tabId="overview" label="Overview" icon={ChartNoAxesCombined} />
          <TabButton tabId="project" label="Projects" icon={ListTodo} />
          <TabButton tabId="tasks" label="Tasks" icon={Calendar} />
          <TabButton tabId="documents" label="Documents" icon={FileText} />
        </nav>
      </div>

      <div className="mt-4">{renderTabContent()}</div>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Goal löschen bestätigen">
        <p className="mb-4">
          Sind Sie sicher, dass Sie das Goal <strong>{goal.name}</strong> dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            Abbrechen
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
          >
            Löschen bestätigen
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GoalDetailView;
