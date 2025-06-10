import React, { useEffect, useState } from 'react';
import { Goal } from '@/models/Goal';
import { Project } from '@/models/Project';
import { ProjectHandler } from '@/models/ProjectHandler';
import { containerStyle, statusLabelStyle } from '@/styles/statusStyles';
import { Sparkles } from 'lucide-react';

interface ProjectTabProps {
  goal: Goal;
}

const ProjectTab: React.FC<ProjectTabProps> = ({ goal }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const handler = React.useMemo(() => ProjectHandler.getInstance(), []);

  useEffect(() => {
    handler
      .getProjectsForGoal(goal.id)
      .then(setProjects)
      .catch(() => setProjects([]));
  }, [goal.id, handler]);

  const generate = async () => {
    try {
      const generated = await handler.generateProjects(goal.id);
      setProjects(prev => [...prev, ...generated]);
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Projects</h4>
        <button
            onClick={generate}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow transition duration-150 ease-in-out text-sm"
          >
            <Sparkles size={16} className="mr-1 sm:mr-2" /> Generate Projects
        </button>
      </div>
      {projects.length > 0 ? (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className={`${containerStyle[project.status]} p-3 border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2`}
            >
              <div>
                <p className="font-medium text-sm text-gray-800">{project.name}</p>
                <p className="text-xs text-gray-600">
                  {project.period[0].toLocaleDateString()} - {project.period[1].toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  Contributes {project.contributionPct}% to this goal.
                </p>
              </div>
              <span
                className={`${statusLabelStyle[project.status]} flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full`}
              >
                {project.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">No projects for this goal.</p>
      )}
    </div>
  );
};

export default ProjectTab;
