import { Goal } from '@/models/Goal';
import { useState } from 'react';
import ClientDetailView from '../ClientDetailView';
import { GoalHandler } from '@/models/GoalHandler';
import { containerStyle, statusLabelStyle } from '@/styles/statusStyles';


export default function GoalPage() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const goals = GoalHandler.getInstance().getGoals();

  return (
    <section className="mb-6 p-4 sm:p-6 rounded-lg shadow border bg-white">
      {selectedGoal ? (
        <ClientDetailView
          client={selectedGoal}
          onBack={() => setSelectedGoal(null)} onSaveChanges={undefined} onDeleteClient={undefined} />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Goals</h2>
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
    </section>
  );
}