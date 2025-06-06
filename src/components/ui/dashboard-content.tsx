'use client';
import { useState } from 'react';
import TaskPage from '../pages/TaskPage';
import { useAppShell } from './app-shell-context';
import { initialClients } from '@/data/initialClients';
import ClientPage from '../pages/ClientPage';
import CommunicationPage from '../pages/CommunicationPage';
import SettingPage from '../pages/SettingPage';

export default function DashboardContent() {
  const [clients, setClients] = useState(initialClients);
  
  const { activeTab } = useAppShell();
  switch (activeTab) {
    case 'Tasks':
      return <TaskPage clients={clients} setClients={setClients} />;
    case 'Kommunikation':
      return <CommunicationPage />;
    case 'Klienten':
      return <ClientPage clients={clients} setClients={setClients} />;
    default:
      return <TaskPage clients={clients} setClients={setClients} />;
  }
}
