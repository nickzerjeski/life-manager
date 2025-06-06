import GoalPage from '../pages/GoalPage';
import { useAppShell } from './app-shell-context';
import ProjectPage from '../pages/ProjectPage';
import CommunicationPage from '../pages/CommunicationPage';
import SettingPage from '../pages/SettingPage';

export default function DashboardContent() {  
  const { activeTab } = useAppShell();
  switch (activeTab) {
    case 'Habits':
      return <CommunicationPage />;
    case 'Projects':
      return <ProjectPage />;
    case 'Goals':
      return <GoalPage />;
    default:
      return <GoalPage />;
  }
}
