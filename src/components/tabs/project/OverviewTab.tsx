import React from 'react'
import { Project } from '@/models/Project'

interface OverviewTabProps {
  project: Project
}

const OverviewTab: React.FC<OverviewTabProps> = ({ project }) => {
  const progress = Math.max(0, Math.min(project.progressPercentage, 100))
  const daysPassed = project.daysElapsed
  const totalDays = project.totalDays
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow rounded p-4 flex flex-col items-center">
        <h3 className="text-sm font-semibold mb-2">Overall Progress</h3>
        <p className="text-xl font-bold">{progress.toFixed(1)}%</p>
      </div>
      <div className="bg-white shadow rounded p-4 flex flex-col items-center">
        <h3 className="text-sm font-semibold mb-2">Time Elapsed</h3>
        <p className="text-xl font-bold">{daysPassed} / {totalDays} days</p>
      </div>
    </div>
  )
}

export default OverviewTab
