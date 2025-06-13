import React, { useEffect, useState } from 'react'
import { Project } from '@shared/models/Project'
import { Topic } from '@shared/models/Topic'
import { Chat } from '@shared/models/Chat'
import { TopicHandler } from '@shared/models/TopicHandler'
import { ChatHandler } from '@shared/models/ChatHandler'
import Modal from '@/components/ui/modal'
import ChatView from '@/components/views/ChatView'
import TopicDetailView from '@/components/views/TopicDetailView'

interface TopicTabProps {
  project: Project
}

const TopicTab: React.FC<TopicTabProps> = ({ project }) => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [markdown, setMarkdown] = useState('')
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
    const [list, md] = await Promise.all([
      chatHandler.getChatsForTopic(topic.id),
      topicHandler.getMarkdownForTopic(topic.id),
    ])
    setChats(list)
    setMarkdown(md)
  }

  useEffect(() => {
    if (markdown && (window as any).MathJax?.typeset) {
      (window as any).MathJax.typeset()
    }
  }, [markdown])

  return (
    <div className="space-y-4">
      {activeTopic ? (
        <TopicDetailView
          topic={activeTopic}
          markdown={markdown}
          chats={chats}
          onBack={() => {
            setActiveTopic(null)
            setChats([])
            setMarkdown('')
          }}
          onOpenChat={chat => setActiveChat(chat)}
        />
      ) : (
        <>
          {topics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map(t => (
                <div
                  key={t.id}
                  onClick={() => openTopic(t)}
                  className="bg-blue-50 border border-blue-200 p-3 rounded-md cursor-pointer hover:shadow flex flex-col gap-2"
                >
                  <h3 className="font-medium text-gray-800">{t.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{t.shortDescription}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">No topics for this project.</p>
          )}
        </>
      )}

      {activeChat && (
        <Modal isOpen={!!activeChat} onClose={() => setActiveChat(null)} title={activeChat.title}>
          <ChatView chat={activeChat} />
        </Modal>
      )}
    </div>
  )
}

export default TopicTab
