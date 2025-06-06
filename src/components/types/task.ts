import { Client } from "./client";
import { Document } from "./document";
import { TaskStatus } from "./types";

export interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    assignedTo?: string;
    dueDate?: string;
    status: TaskStatus; // Offen | In Bearbeitung | Erledigt
    priority?: string;
    courtApprovalRequired: boolean;
    relatedDocuments?: Document[];
    client?: Client;
}