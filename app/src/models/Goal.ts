import { AOL } from "./AOL";
import { Status } from "./Status";
import { APP_CONFIG } from "../utils/appConfig";

export class Goal {
  id: string;
  name: string;
  description: string;
  start: number;
  current: number;
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
     * @param current - Current status or progress of the project.
     * @param objective - Objective or target value for the project.
     * @param period - Tuple containing start and end dates of the project.
     * @param status - Current status of the project.
     * @param goal - Associated goal for the project.
     */
    constructor(id: string, name: string, description: string, start: number, current: number,
                objective: number, period: [Date, Date], aol: AOL) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.start = start;
        this.current = current;
        this.objective = objective;
        this.period = period;
        this.status = Status.NOT_STARTED;
        this.aol = aol;
        this.updateStatus();
    }

    /**
     * Percentage progress based on start, current and objective values.
     */
    get progressPercentage(): number {
        if (this.objective === this.start) return 0;
        return ((this.current - this.start) / (this.objective - this.start)) * 100;
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

    /** Percentage of time elapsed in the goal period. */
    get timePercentage(): number {
        if (this.totalDays === 0) return 100;
        return (this.daysElapsed / this.totalDays) * 100;
    }

    /** Recalculate the status based on progress and elapsed time. */
    updateStatus(): void {
        if (this.current >= this.objective) {
            this.status = Status.ACHIEVED;
            return;
        }

        const today = new Date();
        if (today < this.period[0]) {
            this.status = Status.NOT_STARTED;
            return;
        }

        if (this.daysElapsed === 0) {
            this.status = Status.ON_TRACK;
            return;
        }

        const progress = this.progressPercentage;
        const timePct = this.timePercentage;

        if (progress > timePct) {
            this.status = Status.ON_TRACK;
        } else if (progress >= timePct - APP_CONFIG.status.atRiskRangePct) {
            this.status = Status.AT_RISK;
        } else {
            this.status = Status.OFF_TRACK;
        }
    }
}
