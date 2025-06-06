'use client';
import { useState } from 'react';
import GoalPage from '../pages/GoalPage';
import { useAppShell } from './app-shell-context';
import { initialClients } from '@/data/initialClients';
import ProjectPage from '../pages/ProjectPage';
import CommunicationPage from '../pages/CommunicationPage';
import SettingPage from '../pages/SettingPage';

export default function DashboardContent() {
  const [clients, setClients] = useState(initialClients);
  
  const { activeTab } = useAppShell();
  switch (activeTab) {
    case 'Habits':
      return <CommunicationPage />;
    case 'Projects':
      return <ProjectPage clients={clients} setClients={setClients} />;
    case 'Goals':
      return <GoalPage />;
    default:
      return <GoalPage />;
  }
}
