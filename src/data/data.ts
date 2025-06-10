import fs from 'node:fs'
import path from 'node:path'
import { Goal } from '../models/Goal'
import { Project } from '../models/Project'
import { Document } from '../models/Document'
import { AOL } from '../types/AOL'

export const data = {
  goals: [] as Goal[],
  projects: [] as Project[],
  documents: [] as Document[],
  documentFiles: {} as Record<number, { name: string; content: string }>,
}

export function initData(): void {
  data.goals = [
    new Goal(
      1,
      'Complete project planning',
      'Define detailed steps and milestones',
      0,
      20,
      100,
      [new Date('2025-06-01'), new Date('2025-09-30')],
      AOL.PURPOSE
    ),
    new Goal(
      2,
      'Start MVP implementation',
      'Develop and test core functionality',
      0,
      10,
      100,
      [new Date('2025-06-15'), new Date('2025-10-15')],
      AOL.GROWTH
    ),
    new Goal(
      3,
      'Prepare market launch',
      'Create marketing campaign and documentation',
      0,
      0,
      100,
      [new Date('2025-07-01'), new Date('2025-11-01')],
      AOL.FINANCES
    ),
  ]

  data.projects = [
    new Project(
      1,
      'Solar Farm Expansion',
      'Expand the regional solar farm to 150\u202FMW capacity to support grid stability and meet renewable\u2011energy targets.',
      0,
      30,
      100,
      [new Date('2025-01-01'), new Date('2025-12-31')],
      data.goals[1] || data.goals[0]
    ),
    new Project(
      2,
      'ERP Roll\u2011out',
      'Implement a company\u2011wide ERP solution to unify finance, supply\u2011chain, and HR operations across all business units.',
      0,
      70,
      100,
      [new Date('2024-06-01'), new Date('2025-06-30')],
      data.goals[0] || data.goals[1]
    ),
  ]

  data.documents = [
    new Document(1, data.goals[0].id, 'Course-Info.pdf', 'pdf', new Date('2025-06-05')),
    new Document(2, data.goals[1].id, 'Specification.docx', 'docx', new Date('2025-06-10')),
  ]
  const pdfPath = path.join(__dirname, 'Course-Info.pdf')
  const pdfContent = fs.readFileSync(pdfPath).toString('base64')
  data.documentFiles = { 1: { name: 'Course-Info.pdf', content: pdfContent } }
}
