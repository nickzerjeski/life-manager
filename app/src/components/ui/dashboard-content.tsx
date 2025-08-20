import GoalPage from '../../pages/GoalPage';
import { useAppShell } from './app-shell-context';
import ProjectPage from '../../pages/ProjectPage';
import HabitPage from '../../pages/HabitPage';
import SettingPage from '../../pages/SettingPage';
import HomePage from '../../pages/HomePage';
import CalendarPage from '../../pages/CalendarPage';

export default function DashboardContent() {  
  const { activeTab } = useAppShell();
  switch (activeTab) {
    case 'Home':
      return <HomePage />;
    case 'Habits':
      return <HabitPage />;
    case 'Projects':
      return <ProjectPage />;
    case 'Goals':
      return <GoalPage />;
    case 'Calendar':
      return <CalendarPage />;
    case 'Settings':
      return <SettingPage />;
    default:
      return <HomePage />;
  }
}
