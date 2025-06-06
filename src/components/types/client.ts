import { Task } from "./task";
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  address?: string;
  caseNumber?: string;
  tasks: Task[];
  bankAccounts: any[];
  income: any[];
  expenses: any[];
  doctors: any[];
  documents: any[];
}