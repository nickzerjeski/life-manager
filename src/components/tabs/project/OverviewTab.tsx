import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Project } from '@/models/Project'
import { Topic } from '@/models/Topic'
import { Chat } from '@/models/Chat'
import { TopicHandler } from '@/models/TopicHandler'
import { ChatHandler } from '@/models/ChatHandler'
import Modal from '@/components/ui/modal'

interface OverviewTabProps {
  project: Project
}

const OverviewTab: React.FC<OverviewTabProps> = ({ project }) => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [chatCounts, setChatCounts] = useState<Record<number, number>>({})
  const [markdown, setMarkdown] = useState('')
  const topicHandler = React.useMemo(() => TopicHandler.getInstance(), [])
  const chatHandler = React.useMemo(() => ChatHandler.getInstance(), [])

  useEffect(() => {
    topicHandler
      .getTopicsForProject(project.id)
      .then(setTopics)
      .catch(() => setTopics([]))
  }, [project.id, topicHandler])

  useEffect(() => {
    if (topics.length === 0) return
    Promise.all(
      topics.map(async t => {
        const list = await chatHandler.getChatsForTopic(t.id)
        return [t.id, list.length] as const
      })
    ).then(entries => {
      setChatCounts(Object.fromEntries(entries))
    })
  }, [topics, chatHandler])

  const openTopic = async (topic: Topic) => {
    setActiveTopic(topic)
    const [list, md] = await Promise.all([
      chatHandler.getChatsForTopic(topic.id),
      topicHandler.getMarkdownForTopic(topic.id),
    ])
    setChats(list)
    setMarkdown(md)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map(t => (
          <div
            key={t.id}
            onClick={() => openTopic(t)}
            className="bg-blue-50 border border-blue-200 p-3 rounded-md cursor-pointer hover:shadow flex flex-col gap-2"
          >
            <h3 className="font-medium text-gray-800">{t.name}</h3>
            <div className="flex space-x-1">
              {Array.from({ length: chatCounts[t.id] || 0 }).map((_, i) => (
                <span key={i} className="w-2 h-2 bg-blue-600 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {activeTopic && (
        <Modal
          isOpen={!!activeTopic}
          onClose={() => {
            setActiveTopic(null)
            setChats([])
            setMarkdown('')
          }}
          title={activeTopic.name}
        >
          <div className="space-y-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-sm text-gray-800">
              {markdown}
            </ReactMarkdown>
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className="bg-blue-50 border border-blue-200 p-3 rounded-md cursor-pointer hover:shadow"
              >
                <h4 className="font-medium text-sm text-gray-800">{chat.title}</h4>
                <p className="text-xs text-gray-600">{chat.description}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {activeChat && (
        <Modal isOpen={!!activeChat} onClose={() => setActiveChat(null)} title={activeChat.title}>
          <div className="space-y-2 text-sm">
            {activeChat.messages.map((m, idx) => (
              <p key={idx}>
                <span className="font-semibold mr-2">{m.sender}:</span>
                {m.text}
              </p>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default OverviewTab
