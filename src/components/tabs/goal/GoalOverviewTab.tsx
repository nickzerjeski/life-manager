import React from 'react';
import { Goal } from '@/models/Goal';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { differenceInCalendarDays } from 'date-fns';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale
);

interface GoalOverviewTabProps {
  goal: Goal;
}

const GoalOverviewTab: React.FC<GoalOverviewTabProps> = ({ goal }) => {
  const progress = Math.max(
    0,
    Math.min(
      ((goal.current - goal.start) / (goal.objective - goal.start)) * 100,
      100
    )
  );

  const totalDays = differenceInCalendarDays(goal.period[1], goal.period[0]);
  const daysPassed = Math.max(
    0,
    Math.min(
      differenceInCalendarDays(new Date(), goal.period[0]),
      totalDays
    )
  );
  const daysLeft = Math.max(totalDays - daysPassed, 0);

  const progressData = {
    labels: ['Progress', 'Remaining'],
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ['#2563eb', '#e5e7eb'],
        borderWidth: 0,
      },
    ],
  };

  const daysData = {
    labels: ['Days Passed', 'Days Left'],
    datasets: [
      {
        data: [daysPassed, daysLeft],
        backgroundColor: ['#2563eb', '#d1d5db'],
        borderWidth: 0,
      },
    ],
  };

  const history: { date: string; value: number }[] | undefined = (goal as any).history;
  const historyData = history && history.length > 0 ? {
    labels: history.map(h => h.date),
    datasets: [
      {
        label: 'Progress',
        data: history.map(h => h.value),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.2)',
        tension: 0.3,
      },
    ],
  } : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded p-4 flex flex-col items-center">
        <h3 className="text-sm font-semibold mb-2">Overall Progress</h3>
        <Doughnut data={progressData} className="max-w-xs" />
        <p className="mt-2 text-sm font-medium text-gray-700">{progress.toFixed(1)}%</p>
      </div>
      <div className="bg-white shadow rounded p-4 flex flex-col items-center">
        <h3 className="text-sm font-semibold mb-2">Time Progress</h3>
        <Doughnut data={daysData} className="max-w-xs" />
        <p className="mt-2 text-sm font-medium text-gray-700">{daysPassed} / {totalDays} days</p>
      </div>
      {historyData && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm font-semibold mb-2">Milestones</h3>
          <Line data={historyData} className="h-40" />
        </div>
      )}
    </div>
  );
};

export default GoalOverviewTab;
