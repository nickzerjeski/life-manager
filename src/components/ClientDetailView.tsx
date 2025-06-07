import React, { useState, useEffect } from 'react';
import { User, Landmark, Heart, Calendar, FileText, Trash2, Edit, ArrowLeft } from 'lucide-react';
import Modal from './Modal';
import PersonalTab from './tabs/PersonalTab';
import FinancialTab from './tabs/FinancialTab';
import HealthTab from './tabs/HealthTab';
import TasksTab from './tabs/TasksTab';
import DocumentsTab from './tabs/DocumentsTab';

interface ClientDetailViewProps {
  client: any;
  onBack: () => void;
  onSaveChanges: (client: any) => void;
  onDeleteClient: (id: string) => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, onBack, onSaveChanges, onDeleteClient }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [editedClient, setEditedClient] = useState<any>(client);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setEditedClient(client);
    setIsEditing(false);
    setActiveTab('personal');
  }, [client]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedClient((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scopes = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
    setEditedClient((prev: any) => ({ ...prev, betreuungScope: scopes }));
  };

  const handleSave = () => {
    onSaveChanges(editedClient);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedClient(client);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteClient(client.id);
    setShowDeleteConfirm(false);
  };

  const renderTabContent = () => {
    const commonProps = { client: editedClient, isEditing, onChange: handleInputChange };
    switch (activeTab) {
      case 'personal':
        return <PersonalTab {...commonProps} onScopeChange={handleScopeChange} />;
      case 'financial':
        return <FinancialTab {...commonProps} />;
      case 'health':
        return <HealthTab {...commonProps} />;
      case 'tasks':
        return <TasksTab {...commonProps} />;
      case 'documents':
        return <DocumentsTab {...commonProps} />;
      default:
        return null;
    }
  };

  interface TabButtonProps {
    tabId: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
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
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
        <div className="flex-grow min-w-0">
          <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-2 text-sm">
            <ArrowLeft size={16} className="mr-1" /> Zurück zur Übersicht
          </button>
          <h2 className="text-2xl font-bold text-gray-800 truncate" title={`${client.firstName} ${client.lastName}`}>
            {client.firstName} {client.lastName}
          </h2>
          <p className="text-sm text-gray-500 truncate">Fallnr.: {client.caseNumber} | Gericht: {client.court}</p>
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
          <TabButton tabId="personal" label="Persönliche Daten" icon={User} />
          <TabButton tabId="financial" label="Finanzen" icon={Landmark} />
          <TabButton tabId="health" label="Gesundheit" icon={Heart} />
          <TabButton tabId="tasks" label="Aufgaben" icon={Calendar} />
          <TabButton tabId="documents" label="Dokumente" icon={FileText} />
        </nav>
      </div>

      <div className="mt-4">{renderTabContent()}</div>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Klienten löschen bestätigen">
        <p className="mb-4">
          Sind Sie sicher, dass Sie den Klienten <strong>{client.firstName} {client.lastName}</strong> dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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

export default ClientDetailView;
