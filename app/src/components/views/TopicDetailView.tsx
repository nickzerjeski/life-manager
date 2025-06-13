import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { Topic } from '@shared/models/Topic'
import { Chat } from '@shared/models/Chat'

interface TopicDetailViewProps {
  topic: Topic
  markdown: string
  chats: Chat[]
  onBack: () => void
  onOpenChat: (chat: Chat) => void
}

const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  markdown,
  chats,
  onBack,
  onOpenChat,
}) => {
  const [showChats, setShowChats] = useState(false)
  useEffect(() => {
    if ((window as any).MathJax?.typeset) {
      ;(window as any).MathJax.typeset()
    }
  }, [markdown])

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} aria-label="Back to Topics">
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-xl font-bold text-gray-800 truncate" title={topic.name}>
          {topic.name}
        </h3>
      </div>
      <ReactMarkdown
        className="prose max-w-none text-gray-800 mb-4"
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
        {markdown}
      </ReactMarkdown>
      {chats.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowChats(v => !v)}
            className="flex items-center gap-1 mt-4"
          >
            <h4 className="text-md font-semibold text-gray-700 m-0">Chats</h4>
            {showChats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showChats && (
            <div className="space-y-2 mt-2">
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => onOpenChat(chat)}
                  className="bg-blue-50 border border-blue-200 p-3 rounded-md cursor-pointer hover:shadow"
                >
                  <h4 className="font-medium text-sm text-gray-800">{chat.title}</h4>
                  <p className="text-xs text-gray-600">{chat.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TopicDetailView
