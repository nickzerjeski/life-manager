export interface Task {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  priority: number; // 1-5
  dependencyIds: string[];
  completed: boolean;
}

export interface Project {
  id: string;
  goalId: string;
  name: string;
  period: { from: string; to: string };
  status: 'Not started' | 'On Track' | 'At Risk' | 'Off Track' | 'Achieved';
  tasks: Task[];
}

export interface Goal {
  id: string;
  name: string;
  period: { from: string; to: string };
  status: 'Not started' | 'On Track' | 'At Risk' | 'Off Track' | 'Achieved';
  areaOfLife: string;
  projects: Project[];
}
