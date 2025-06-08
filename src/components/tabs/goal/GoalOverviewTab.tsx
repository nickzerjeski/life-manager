import React from 'react';
import { Goal } from '@/models/Goal';
import { differenceInCalendarDays } from 'date-fns';
import dynamic from 'next/dynamic';

interface GoalOverviewTabProps {
  goal: Goal;
}

const RadialChart = dynamic(() => import('@/components/ui/RadialChart'), {
  ssr: false,
});

const GoalOverviewTab: React.FC<GoalOverviewTabProps> = ({ goal }) => {
  const progress = Math.max(
    0,
    Math.min(
      ((goal.stand - goal.start) / (goal.objective - goal.start)) * 100,
      100
    )
  );

  const totalDays = differenceInCalendarDays(goal.period[1], goal.period[0]);

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col items-center">
      <h3 className="text-sm font-semibold mb-4">Goal Progress</h3>
      <RadialChart progress={progress} totalDays={totalDays} />
    </div>
  );
};

export default GoalOverviewTab;
