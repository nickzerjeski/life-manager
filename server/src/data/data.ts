import fs from 'node:fs'
import path from 'node:path'

/**
 * Simple in-memory data store used by the development server. All data is
 * loaded from static files on startup and never persisted to disk. This keeps
 * the server stateless and easy to reset between tests.
 */
import { Goal } from '../../../shared/models/Goal'
import { Project } from '../../../shared/models/Project'
import { Document } from '../../../shared/models/Document'
import { Task } from '../../../shared/models/Task'
import { Topic } from '../../../shared/models/Topic'
import { Chat } from '../../../shared/models/Chat'
import { AOL } from '../../../shared/types/AOL'

/**
 * Central object holding all mocked domain entities during runtime.
 */
export const data = {
  goals: [] as Goal[],
  projects: [] as Project[],
  tasks: [] as Task[],
  documents: [] as Document[],
  documentFiles: {} as Record<number, { name: string; content: string }>,
  topics: [] as Topic[],
  chats: [] as Chat[],
  topicMarkdown: {} as Record<number, string>,
}

/**
 * Populate the in-memory store with a deterministic set of demo data.
 * This makes it easier to run the application without a real database and
 * provides consistent fixtures for the test suite.
 */
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
    new Goal(
      4,
      'Masters Degree',
      'Complete Master of Science in Computer Science',
      0,
      30,
      120,
      [new Date('2024-09-01'), new Date('2026-05-31')],
      AOL.GROWTH
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
      data.goals[1] || data.goals[0],
      50
    ),
    new Project(
      2,
      'ERP Roll\u2011out',
      'Implement a company\u2011wide ERP solution to unify finance, supply\u2011chain, and HR operations across all business units.',
      0,
      70,
      100,
      [new Date('2024-06-01'), new Date('2025-06-30')],
      data.goals[0] || data.goals[1],
      50
    ),
    new Project(
      3,
      'Advanced Algorithms',
      fs.readFileSync(
        path.join(__dirname, 'projects', 'advanced-algorithms.md'),
        'utf8'
      ),
      0,
      0,
      100,
      [new Date('2024-09-01'), new Date('2024-12-15')],
      data.goals[3],
      100
    ),
  ]

  data.tasks = [
    new Task(
      1,
      'Initial planning',
      new Date('2025-01-15'),
      data.projects[0],
      3600
    ),
  ]

  data.documents = [
    new Document(1, { goalId: data.goals[0].id }, 'Course-Info.pdf', 'pdf', new Date('2025-06-05')),
    new Document(2, { goalId: data.goals[1].id }, 'Specification.docx', 'docx', new Date('2025-06-10')),
  ]

  data.topics = [
    new Topic(1, 'Graph Algorithms', data.projects[2]),
    new Topic(2, 'Approximation Algorithms', data.projects[2]),
    new Topic(3, 'Randomized Algorithms', data.projects[2]),
  ]

  data.chats = [
    new Chat(
      1,
      "Dijkstra's with heaps",
      'Discuss using a binary heap for Dijkstra implementation',
      [
        { sender: 'user', text: 'How does a heap improve Dijkstra?' },
        { sender: 'assistant', text: 'It lowers the cost of extracting the min vertex to O(log n).' },
        { sender: 'user', text: 'Is a Fibonacci heap better?' },
        { sender: 'assistant', text: 'Theoretically yes, but constant factors matter.' },
      ],
      data.topics[0]
    ),
    new Chat(
      2,
      'Bellman-Ford insights',
      'Clarification about negative cycles detection',
      [
        { sender: 'user', text: 'When does Bellman-Ford detect negative cycles?' },
        { sender: 'assistant', text: 'After relaxing edges |V|-1 times, an additional pass that improves a distance reveals a cycle.' },
        { sender: 'user', text: 'So complexity is O(VE)?' },
        { sender: 'assistant', text: 'Exactly.' },
      ],
      data.topics[0]
    ),
    new Chat(
      3,
      'Topological ordering',
      'Algorithm to order vertices in DAG',
      [
        { sender: 'user', text: 'What is the simplest way to topologically sort?' },
        { sender: 'assistant', text: 'Perform DFS and record the finish order.' },
      ],
      data.topics[0]
    ),

    new Chat(
      4,
      'Set cover approximation',
      'Reason about greedy guarantees',
      [
        { sender: 'user', text: 'Why does the greedy algorithm give log n approximation?' },
        { sender: 'assistant', text: 'It relates to the harmonic series when covering remaining elements.' },
      ],
      data.topics[1]
    ),
    new Chat(
      5,
      'Vertex cover via LP',
      'Using linear programming relaxation for approximation',
      [
        { sender: 'user', text: 'How do we round the LP solution?' },
        { sender: 'assistant', text: 'Pick all vertices with value >= 1/2.' },
      ],
      data.topics[1]
    ),
    new Chat(
      6,
      'PTAS discussion',
      'Exploring PTAS for knapsack',
      [
        { sender: 'user', text: 'Is there a PTAS for knapsack?' },
        { sender: 'assistant', text: 'Yes, by scaling item values and using dynamic programming.' },
      ],
      data.topics[1]
    ),

    new Chat(
      7,
      'Randomized quicksort',
      'Expected running time reasoning',
      [
        { sender: 'user', text: 'Why is randomized quicksort expected O(n log n)?' },
        { sender: 'assistant', text: 'The expected number of comparisons forms the recurrence solving to n log n.' },
      ],
      data.topics[2]
    ),
    new Chat(
      8,
      'Markov inequality use',
      'Using Markov for algorithm analysis',
      [
        { sender: 'user', text: 'How is Markov inequality applied in randomised algorithms?' },
        { sender: 'assistant', text: 'It bounds the probability that a non-negative random variable exceeds a threshold.' },
      ],
      data.topics[2]
    ),
    new Chat(
      9,
      'Coupon collector problem',
      'Expected trials to collect all coupons',
      [
        { sender: 'user', text: 'What is the expected number of coupons needed?' },
        { sender: 'assistant', text: 'Approximately n log n for n coupon types.' },
        { sender: 'user', text: 'Any tail bounds available?' },
        { sender: 'assistant', text: 'Yes, via Chernoff bounds.' },
      ],
      data.topics[2]
    ),
  ]
  const pdfPath = path.join(__dirname, 'Course-Info.pdf')
  const pdfContent = fs.readFileSync(pdfPath).toString('base64')
  data.documentFiles = { 1: { name: 'Course-Info.pdf', content: pdfContent } }

  const md1 = fs.readFileSync(path.join(__dirname, 'topics', 'graph-algorithms.md'), 'utf8')
  const md2 = fs.readFileSync(
    path.join(__dirname, 'topics', 'approximation-algorithms.md'),
    'utf8'
  )
  const md3 = fs.readFileSync(path.join(__dirname, 'topics', 'randomized-algorithms.md'), 'utf8')
  data.topicMarkdown = { 1: md1, 2: md2, 3: md3 }
}
