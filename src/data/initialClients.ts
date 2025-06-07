import { TaskStatus } from '@/components/types/types';

export interface BankAccount {
  id: string;
  bankName: string;
  iban: string;
  bic: string;
  balance: number;
}

export interface IncomeItem {
  id: string;
  source: string;
  amount: number;
  frequency: string;
}

export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  frequency: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
}

export interface ClientTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  status: TaskStatus;
}

export interface ClientDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  phone: string;
  email: string;
  betreuungScope: string[];
  court: string;
  caseNumber: string;
  socialSecurityNumber: string;
  taxId: string;
  healthInsurance: string;
  insuranceNumber: string;
  pensionNumber: string;
  bankAccounts: BankAccount[];
  income: IncomeItem[];
  expenses: ExpenseItem[];
  doctors: Doctor[];
  tasks: ClientTask[];
  documents: ClientDocument[];
}

export const initialClients: Client[] = [
  {
    id: '1',
    firstName: 'Max',
    lastName: 'Mustermann',
    dob: '1950-05-15',
    address: 'Hauptstraße 1, 10115 Berlin',
    phone: '030 1234567',
    email: 'max.mustermann@email.de',
    betreuungScope: [
      'Vermögenssorge',
      'Gesundheitssorge',
      'Aufenthaltsbestimmung',
      'Postangelegenheiten',
    ],
    court: 'Amtsgericht Mitte',
    caseNumber: '12 B 345/23',
    socialSecurityNumber: '12 150550 M 123',
    taxId: '12345678901',
    healthInsurance: 'AOK Nordost',
    insuranceNumber: 'M123456789',
    pensionNumber: '987654321M150550',
    bankAccounts: [
      { id: 'b1', bankName: 'Berliner Sparkasse', iban: 'DE89 1005 0000 0190 0123 45', bic: 'BELADEBEXXX', balance: 1250.75 },
      { id: 'b2', bankName: 'Deutsche Bank', iban: 'DE02 1007 0000 0123 4567 89', bic: 'DEUTDEBBXXX', balance: 5300.10 },
    ],
    income: [
      { id: 'i1', source: 'Rente', amount: 1100, frequency: 'Monthly' },
      { id: 'i2', source: 'Grundsicherung', amount: 450, frequency: 'Monthly' },
    ],
    expenses: [
      { id: 'e1', category: 'Rent', amount: 650, frequency: 'Monthly' },
      { id: 'e2', category: 'Utilities', amount: 120, frequency: 'Monthly' },
      { id: 'e3', category: 'Insurance (Haftpflicht)', amount: 80, frequency: 'Yearly' },
    ],
    doctors: [
      { id: 'd1', name: 'Dr. Anna Schmidt', specialty: 'Hausarzt', phone: '030 9876543' },
    ],
    tasks: [
      { id: 't1', title: 'Apply for Wohngeld', description: 'Apply for Wohngeld description', dueDate: '2025-05-15', completed: false, status: TaskStatus.OPEN },
      { id: 't2', title: 'Pay electricity bill', description: 'Pay electricity bill description', dueDate: '2025-04-20', completed: true, status: TaskStatus.DONE },
    ],
    documents: [
      { id: 'doc1', name: 'Betreuungsurkunde.pdf', type: 'Legal', uploadDate: '2023-11-10' },
      { id: 'doc2', name: 'Mietvertrag.pdf', type: 'Housing', uploadDate: '2024-01-05' },
    ],
  },
  {
    id: '2',
    firstName: 'Erika',
    lastName: 'Musterfrau',
    dob: '1962-11-22',
    address: 'Nebenstraße 5, 80331 München',
    phone: '089 9876543',
    email: 'erika.musterfrau@email.de',
    betreuungScope: ['Vermögenssorge', 'Aufenthaltsbestimmung'],
    court: 'Amtsgericht München',
    caseNumber: '34 C 678/24',
    socialSecurityNumber: '12 221162 F 456',
    taxId: '98765432109',
    healthInsurance: 'Techniker Krankenkasse',
    insuranceNumber: 'F987654321',
    pensionNumber: '123456789F221162',
    bankAccounts: [
      { id: 'b3', bankName: 'Commerzbank', iban: 'DE91 7004 0041 0123 4567 00', bic: 'COBADEFFXXX', balance: 875.30 },
    ],
    income: [
      { id: 'i3', source: 'Pension', amount: 950, frequency: 'Monthly' },
    ],
    expenses: [
      { id: 'e4', category: 'Care Home Fees', amount: 1500, frequency: 'Monthly' },
    ],
    doctors: [],
    tasks: [
      { id: 't3', title: 'Review care plan', description: 'Review care plan description', dueDate: '2025-06-01', completed: false, status: TaskStatus.IN_PROGRESS },
    ],
    documents: [
      { id: 'doc3', name: 'Heimvertrag.pdf', type: 'Housing', uploadDate: '2024-03-15' },
    ],
  },
];
