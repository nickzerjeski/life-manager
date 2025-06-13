import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Project } from '@shared/models/Project'
import { TaskHandler } from '@shared/models/TaskHandler'
import { TopicHandler } from '@shared/models/TopicHandler'
import { DocumentHandler } from '@shared/models/DocumentHandler'
import { APP_CONFIG } from '@shared/utils/appConfig'
import { Progbar } from '@/components/ui/progress-bar'
import { Separator } from '@/components/ui/separator'

interface OverviewTabProps {
  project: Project
}

const OverviewTab: React.FC<OverviewTabProps> = ({ project }) => {
  const [counts, setCounts] = useState({ tasks: 0, topics: 0, documents: 0 })
  const taskHandler = React.useMemo(() => TaskHandler.getInstance(), [])
  const topicHandler = React.useMemo(() => TopicHandler.getInstance(), [])
  const documentHandler = React.useMemo(() => DocumentHandler.getInstance(), [])

  useEffect(() => {
    Promise.all([
      taskHandler.getTasksForProject(project.id),
      topicHandler.getTopicsForProject(project.id),
      documentHandler.getDocumentsForProject(project.id),
    ])
      .then(([t, tp, d]) =>
        setCounts({ tasks: t.length, topics: tp.length, documents: d.length })
      )
      .catch(() => setCounts({ tasks: 0, topics: 0, documents: 0 }))
  }, [project.id, taskHandler, topicHandler, documentHandler])

  const progress = Math.round(project.progressPercentage)
  const time = Math.round(project.timePercentage)
  const riskRange = APP_CONFIG.status.atRiskRangePct
  const riskStart = Math.max(0, time - riskRange)
  const riskEnd = Math.min(100, time + riskRange)

  useEffect(() => {
    if ((window as any).MathJax?.typeset) {
      ;(window as any).MathJax.typeset()
    }
  }, [project.description])

  return (
    <div className="space-y-4">
      <div className="flex justify-around border-b border-gray-200 pb-4">
        <div className="flex flex-col items-center flex-1">
          <span className="text-2xl font-bold text-gray-800">{counts.tasks}</span>
          <span className="text-sm text-gray-600">Tasks</span>
        </div>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-2xl font-bold text-gray-800">{counts.topics}</span>
          <span className="text-sm text-gray-600">Topics</span>
        </div>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-2xl font-bold text-gray-800">{counts.documents}</span>
          <span className="text-sm text-gray-600">Documents</span>
        </div>
      </div>
      <div className="space-y-2">
        <Progbar name="Time" progress={time} />
        <Progbar
          name="Progress"
          progress={progress}
          range={[riskStart, riskEnd]}
        />
      </div>
      <Separator className="my-2" />
      <ReactMarkdown
        className="prose max-w-none text-gray-800"
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <table className="min-w-full border border-gray-300 text-sm" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border px-2 py-1 bg-gray-100 text-left" {...props} />
          ),
          td: ({ node, ...props }) => <td className="border px-2 py-1" {...props} />,
        }}
      >
        {project.description}
      </ReactMarkdown>
    </div>
  )
}

export default OverviewTab
