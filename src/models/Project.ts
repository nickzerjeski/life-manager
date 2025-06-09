import { Status } from "@/types/Status";
import { Goal } from "@/models/Goal";

export class Project {
  id: number;
  name: string;
  description: string;
  start: number;
  current: number;
  objective: number;
  period: [Date, Date];
  status: Status;
  goal: Goal;
    
    /**
     * Creates a new Project instance.
     * @param id - Unique identifier for the project.
     * @param name - Name of the project.
     * @param description - Description of the project.
     * @param start - Start value of the project.
     * @param current - Current status or progress of the project.
     * @param objective - Objective or target value for the project.
     * @param period - Tuple containing start and end dates of the project.
     * @param status - Current status of the project.
     * @param goal - Associated goal for the project.
     */
    constructor(id: number, name: string, description: string, start: number, current: number,
                objective: number, period: [Date, Date], status: Status, goal: Goal) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.start = start;
        this.current = current;
        this.objective = objective;
        this.period = period;
        this.status = status;
        this.goal = goal;
    }
}
