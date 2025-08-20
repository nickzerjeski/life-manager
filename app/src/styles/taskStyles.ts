import { AutomationState } from '@/models/Task'

export const manualTaskStyle = 'bg-blue-50 border border-blue-200'

export const automationTaskStyle: Record<AutomationState, string> = {
  running: 'bg-green-50 border border-green-200 animate-pulse',
  attention: 'bg-orange-50 border border-orange-200',
  not_started: 'bg-gray-50 border border-gray-200',
  failed: 'bg-red-50 border border-red-200',
}
