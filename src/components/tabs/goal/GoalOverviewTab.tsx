import React from 'react';
import { Goal } from '@/models/Goal';
import { differenceInCalendarDays } from 'date-fns';
import RadialChart from '@/components/ui/RadialChart';

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

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col items-center">
      <h3 className="text-sm font-semibold mb-4">Goal Progress</h3>
      <RadialChart progress={progress} label={`${daysLeft}d left`} />
    </div>
  );
};

export default GoalOverviewTab;
