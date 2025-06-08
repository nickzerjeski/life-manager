import React from 'react';
import { Goal } from '@/models/Goal';
import { differenceInCalendarDays } from 'date-fns';

interface GoalOverviewTabProps {
  goal: Goal;
}

const GoalOverviewTab: React.FC<GoalOverviewTabProps> = ({ goal }) => {
  const progress = Math.max(
    0,
    Math.min(
      ((goal.stand - goal.start) / (goal.objective - goal.start)) * 100,
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

  const timeProgress = totalDays > 0 ? (daysPassed / totalDays) * 100 : 0;

  const radiusOuter = 54;
  const radiusInner = 44;
  const circumferenceOuter = 2 * Math.PI * radiusOuter;
  const circumferenceInner = 2 * Math.PI * radiusInner;
  const offsetOuter = circumferenceOuter - (progress / 100) * circumferenceOuter;
  const offsetInner = circumferenceInner - (timeProgress / 100) * circumferenceInner;

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col items-center">
      <h3 className="text-sm font-semibold mb-4">Goal Progress</h3>
      <svg className="w-32 h-32" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radiusOuter}
          strokeWidth="8"
          className="text-gray-200"
          fill="none"
          stroke="currentColor"
        />
        <circle
          cx="60"
          cy="60"
          r={radiusOuter}
          strokeWidth="8"
          className="text-blue-600"
          fill="none"
          strokeDasharray={circumferenceOuter}
          strokeDashoffset={offsetOuter}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          stroke="currentColor"
        />
        <circle
          cx="60"
          cy="60"
          r={radiusInner}
          strokeWidth="8"
          className="text-gray-300"
          fill="none"
          stroke="currentColor"
        />
        <circle
          cx="60"
          cy="60"
          r={radiusInner}
          strokeWidth="8"
          className="text-green-500"
          fill="none"
          strokeDasharray={circumferenceInner}
          strokeDashoffset={offsetInner}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          stroke="currentColor"
        />
        <text
          x="60"
          y="55"
          textAnchor="middle"
          className="text-sm font-semibold fill-gray-700"
        >
          {progress.toFixed(1)}%
        </text>
        <text x="60" y="72" textAnchor="middle" className="text-xs fill-gray-500">
          {daysLeft}d left
        </text>
      </svg>
    </div>
  );
};

export default GoalOverviewTab;
