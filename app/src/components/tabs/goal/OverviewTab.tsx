import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Goal } from '@shared/models/Goal';
import { ProjectHandler } from '@shared/models/ProjectHandler';
import { DocumentHandler } from '@shared/models/DocumentHandler';
import { APP_CONFIG } from '@shared/utils/appConfig';
import { Progbar } from '@/components/ui/progress-bar';
import { Separator } from '@/components/ui/separator';

interface OverviewTabProps {
  goal: Goal;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ goal }) => {
  const [counts, setCounts] = useState({ projects: 0, documents: 0 });
  const [markdown, setMarkdown] = useState('');
  const projectHandler = React.useMemo(() => ProjectHandler.getInstance(), []);
  const documentHandler = React.useMemo(() => DocumentHandler.getInstance(), []);

  useEffect(() => {
    Promise.all([
      projectHandler.getProjectsForGoal(goal.id),
      documentHandler.getDocumentsForGoal(goal.id),
    ])
      .then(([p, d]) => setCounts({ projects: p.length, documents: d.length }))
      .catch(() => setCounts({ projects: 0, documents: 0 }));
    documentHandler
      .getMarkdownForGoal(goal.id)
      .then(setMarkdown)
      .catch(() => setMarkdown(''));
  }, [goal.id, projectHandler, documentHandler]);

  const progress = Math.round(goal.progressPercentage);
  const time = Math.round(goal.timePercentage);
  const riskRange = APP_CONFIG.status.atRiskRangePct;
  const riskStart = Math.max(0, time - riskRange);
  const riskEnd = Math.min(100, time + riskRange);

  useEffect(() => {
    if ((window as any).MathJax?.typeset) {
      (window as any).MathJax.typeset();
    }
  }, [markdown]);

  return (
    <div className="space-y-4">
      <div className="flex item-stretch justify-around pb-4">
        <div className="flex flex-col items-center flex-1">
          <span className="text-2xl font-bold text-gray-800">{counts.projects}</span>
          <span className="text-sm text-gray-600">Projects</span>
        </div>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-2xl font-bold text-gray-800">{counts.documents}</span>
          <span className="text-sm text-gray-600">Documents</span>
        </div>
      </div>
      <div className="space-y-2">
        <Progbar name="Time Passed" progress={time} />
        <Progbar name="Progress" progress={progress} range={[riskStart, riskEnd]} />
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
        {markdown || goal.description}
      </ReactMarkdown>
    </div>
  );
};

export default OverviewTab;
