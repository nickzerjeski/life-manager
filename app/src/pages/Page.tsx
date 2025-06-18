import DashboardContent from '@/components/ui/dashboard-content';
import { GoalHandler } from '@/models/GoalHandler';
import { ProjectHandler } from '@/models/ProjectHandler';

// initialize handlers on first load
const goals = GoalHandler.getInstance();
ProjectHandler.getInstance(goals);

export default function Home() {
/* ---------- single source of truth for client list ---------- */
  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4 md:p-8 font-sans">
      <main className="container mx-auto max-w-7xl space-y-8">
        <DashboardContent />
      </main>
      <footer className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} Lifemanager App Prototype.
      </footer>
    </div>
  );
}
