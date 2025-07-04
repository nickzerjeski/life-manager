import { JSX, useState } from 'react'
import {
  Share2,
  Printer,
  Download,
  Copy,
  Plus,
  Edit,
  BotMessageSquare,
} from 'lucide-react'

interface SpeedDialProps {
  onAskQuestion?: () => void
}

interface Action {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const SpeedDial: React.FC<SpeedDialProps> = ({ onAskQuestion }) => {
  const [open, setOpen] = useState(false);

  const actions: Action[] = [
    { label: "Edit", icon: <Edit className="w-5 h-5" />, onClick: () => {} },
    {
      label: 'Ask a Question',
      icon: <BotMessageSquare className="w-5 h-5" />,
      onClick: () => {
        onAskQuestion?.()
      },
    },
    //{ label: "Download", icon: <Download className="w-5 h-5" />, onClick: () => {} },
    //{ label: "Copy", icon: <Copy className="w-5 h-5" />, onClick: () => {} },
  ];

  return (
    <div className="fixed end-6 bottom-6 group">
      <div className={`flex flex-col items-center mb-4 space-y-2 transition-all duration-300 ${open ? "block" : "hidden"}`}>
        {actions.map((action, idx) => (
          <button
            key={idx}
            type="button"
            onClick={action.onClick}
            className="relative flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-xs dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
          >
            {action.icon}
            <span className="sr-only">{action.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="flex items-center justify-center text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
      >
        <Plus className={`w-5 h-5 transition-transform ${open ? "rotate-45" : ""}`} />
        <span className="sr-only">Open actions menu</span>
      </button>
    </div>
  );
};
