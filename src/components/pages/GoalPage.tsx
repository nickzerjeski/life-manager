import { Goal } from '@/models/Goal';
import { Status } from '@/types/Status';
import { useState } from 'react';
import ClientDetailView from '../ClientDetailView';
import { AOL } from '@/types/AOL';
import { containerStyle, statusLabelStyle } from '@/styles/statusStyles';


export default function GoalPage() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const dummyGoals: Goal[] = [
    new Goal(
      1,
      'Projektplanung abschließen',
      'Detaillierte Schritte und Meilensteine festlegen',
      0,
      20,
      100,
      [new Date('2025-06-01'), new Date('2025-09-30')],
      Status.ON_TRACK,
      AOL.PURPOSE
    ),
    new Goal(
      2,
      'MVP-Implementierung starten',
      'Kernfunktionalität entwickeln und testen',
      0,
      10,
      100,
      [new Date('2025-06-15'), new Date('2025-10-15')],
      Status.AT_RISK,
      AOL.GROWTH
    ),
    new Goal(
      3,
      'Markteinführung vorbereiten',
      'Marketing-Kampagne und Dokumentation erstellen',
      0,
      0,
      100,
      [new Date('2025-07-01'), new Date('2025-11-01')],
      Status.OFF_TRACK,
      AOL.FINANCES
    ),
  ];

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
            {dummyGoals.map((goal) => (
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