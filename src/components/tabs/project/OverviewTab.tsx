import React, { useEffect, useState } from 'react'
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
  const topicHandler = React.useMemo(() => TopicHandler.getInstance(), [])
  const chatHandler = React.useMemo(() => ChatHandler.getInstance(), [])

  useEffect(() => {
    topicHandler
      .getTopicsForProject(project.id)
      .then(setTopics)
      .catch(() => setTopics([]))
  }, [project.id, topicHandler])

  const openTopic = async (topic: Topic) => {
    setActiveTopic(topic)
    const list = await chatHandler.getChatsForTopic(topic.id)
    setChats(list)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map(t => (
          <div
            key={t.id}
            onClick={() => openTopic(t)}
            className="bg-white shadow rounded p-4 border cursor-pointer hover:shadow-md"
          >
            <h3 className="text-lg font-semibold">{t.name}</h3>
          </div>
        ))}
      </div>

      {activeTopic && (
        <Modal isOpen={!!activeTopic} onClose={() => { setActiveTopic(null); setChats([]) }} title={activeTopic.name}>
          <div className="space-y-2">
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className="bg-white shadow rounded p-4 border cursor-pointer hover:shadow-md"
              >
                <h4 className="font-medium">{chat.title}</h4>
                <p className="text-sm text-gray-600">{chat.description}</p>
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
