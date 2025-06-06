import { Task } from "./task";

export interface Conversation {
    id: number;
    summary: string;
    relatedTask: Task;
    completed: boolean;
    messages: Message[]; //Message hat Sender, Inhalt
}