import React from 'react'
import { Goal } from '@/models/Goal'
import { Progress } from '@/components/ui/progress'

interface GoalOverviewTabProps {
  goal: Goal
}

const GoalOverviewTab: React.FC<GoalOverviewTabProps> = ({ goal }) => {
  const progress = Math.round(goal.progressPercentage)
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Progress</p>
        <Progress value={progress} />
        <p className="text-sm text-gray-600 mt-1">{progress}%</p>
      </div>
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Start:</span> {goal.period[0].toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">End:</span> {goal.period[1].toLocaleDateString()}
        </p>
        <p>
          {goal.daysElapsed} days elapsed, {goal.daysRemaining} days remaining
        </p>
      </div>
    </div>
  )
}

export default GoalOverviewTab
