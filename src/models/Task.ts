export class Task {
  id: number;
  description: string;
  deadline: Date;
  project: string;
  duration: number;
  dependencies: Task[];
    /**
     * Creates a new Task instance.
     * @param id - Unique identifier for the task.
     * @param description - Description of the task.
     * @param deadline - Deadline for the task.
     * @param project - Project to which the task belongs.
     * @param duration - Estimated duration of the task in seconds.
     * @param dependencies - List of tasks that this task depends on.
    */
    constructor(id: number, description: string, deadline: Date, project: string, duration: number, dependencies: Task[] = []) {
        this.id = id;
        this.description = description;
        this.deadline = deadline;
        this.project = project;
        this.duration = duration;
        this.dependencies = dependencies;
    }

    /**
     * Returns a string representation of the task.
     * @returns A string describing the task.
    */
    toString(): string {
        return `Task[${this.id}]: ${this.description} (Deadline: ${this.deadline.toISOString()}, Project: ${this.project}, Duration: ${this.duration}s, Dependencies: [${this.dependencies.join(', ')}])`;
    }
}
