import { Project } from './Project'

export class Task {
  id: number
  name: string
  description: string
  deadline: Date
  project: Project
  duration: number
  dependencies: Task[]
  completedAt?: Date | null
    /**
     * Creates a new Task instance.
     * @param id - Unique identifier for the task.
     * @param description - Description of the task.
     * @param deadline - Deadline for the task.
     * @param project - Project to which the task belongs.
     * @param duration - Estimated duration of the task in seconds.
     * @param dependencies - List of tasks that this task depends on.
    */
    constructor(
        id: number,
        name: string,
        description: string,
        deadline: Date,
        project: Project,
        duration: number,
        dependencies: Task[] = [],
        completedAt: Date | null = null
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.project = project;
        this.duration = duration;
        this.dependencies = dependencies;
        this.completedAt = completedAt;
    }

    /**
     * Returns a string representation of the task.
     * @returns A string describing the task.
    */
    toString(): string {
        return `Task[${this.id} ${this.name}]: ${this.description} (Deadline: ${this.deadline.toISOString()}, Project: ${this.project.name}, Duration: ${this.duration}s, Dependencies: [${this.dependencies.map(d => d.id).join(', ')}], Completed: ${this.completedAt ? this.completedAt.toISOString() : 'n/a'})`;
    }
}

export class ManualTask extends Task {}

export type AutomationState = 'running' | 'attention' | 'not_started' | 'failed'

export class AutomatedTask extends Task {
    status: AutomationState

    constructor(
        id: number,
        name: string,
        description: string,
        deadline: Date,
        project: Project,
        duration: number,
        status: AutomationState,
        dependencies: Task[] = [],
        completedAt: Date | null = null
    ) {
        super(id, name, description, deadline, project, duration, dependencies, completedAt)
        this.status = status
    }
}
