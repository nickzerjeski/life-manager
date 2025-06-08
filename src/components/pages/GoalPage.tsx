import { Goal } from '@/models/Goal';
import { useEffect, useState } from 'react';
import GoalDetailView from '../views/GoalDetailView';
import { GoalHandler } from '@/models/GoalHandler';
import { containerStyle, statusLabelStyle } from '@/styles/statusStyles';
import { Plus } from 'lucide-react';
import AddGoalModal from '@/modal/AddGoalModal';


export default function GoalPage() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  useEffect(() => {
    GoalHandler.getInstance()
      .getGoals()
      .then(setGoals)
      .catch(() => setGoals([]));
  }, []);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <section className="mb-6 p-4 sm:p-6 rounded-lg shadow border bg-white">
      {selectedGoal ? (
        <GoalDetailView goal={selectedGoal} onBack={() => setSelectedGoal(null)} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Goals</h2>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
            >
              <Plus size={18} className="mr-2" /> Add Goal
            </button>
          </div>
          <ul className="space-y-4">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className={`${containerStyle[goal.status]} p-3 border rounded-md flex flex-col
                          sm:flex-row justify-between items-start sm:items-center
                          gap-2 cursor-pointer transition-shadow hover:shadow-md `}
                onClick={() => setSelectedGoal(goal)}
              >
                <div>
                  <p className="font-medium text-sm text-gray-800">{goal.name}</p>
                  <p className="text-xs text-gray-500">{goal.description}</p>
                  <p className="text-xs text-gray-600">{goal.period[0].toLocaleDateString()} - {goal.period[1].toLocaleDateString()}</p>
                </div>
                <span
                  className={`${statusLabelStyle[goal.status]} flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full `}
                >
                  {goal.status}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      <AddGoalModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={async () => {
          const updated = await GoalHandler.getInstance().getGoals();
          setGoals(updated);
        }}
      />
    </section>
  );
}