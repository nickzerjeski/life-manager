import { AOL } from "@/types/AOL";
import { Status } from "@/types/Status";

export class Goal {
  id: number;
  name: string;
  description: string;
  start: number;
  stand: number;
  objective: number;
  period: [Date, Date];
  status: Status;
  aol: AOL;
    
    /**
     * Creates a new Project instance.
     * @param id - Unique identifier for the project.
     * @param name - Name of the project.
     * @param description - Description of the project.
     * @param start - Start value of the project.
     * @param stand - Current status or progress of the project.
     * @param objective - Objective or target value for the project.
     * @param period - Tuple containing start and end dates of the project.
     * @param status - Current status of the project.
     * @param goal - Associated goal for the project.
     */
    constructor(id: number, name: string, description: string, start: number, stand: number,
                objective: number, period: [Date, Date], status: Status, aol: AOL) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.start = start;
        this.stand = stand;
        this.objective = objective;
        this.period = period;
        this.status = status;
        this.aol = aol;
    }

    /**
     * Percentage progress based on start, stand and objective values.
     */
    get progressPercentage(): number {
        if (this.objective === this.start) return 0;
        return ((this.stand - this.start) / (this.objective - this.start)) * 100;
    }

    /** Total number of days for the goal period. */
    get totalDays(): number {
        const ms = this.period[1].getTime() - this.period[0].getTime();
        return Math.ceil(ms / (1000 * 60 * 60 * 24));
    }

    /** Days elapsed since the start of the goal. */
    get daysElapsed(): number {
        const now = new Date();
        const ms = now.getTime() - this.period[0].getTime();
        return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
    }

    /** Remaining days until the goal ends. */
    get daysRemaining(): number {
        const now = new Date();
        const ms = this.period[1].getTime() - now.getTime();
        return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    }
}
