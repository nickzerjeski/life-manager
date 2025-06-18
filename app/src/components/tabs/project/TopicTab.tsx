import React, { useEffect, useState } from 'react'
import { Project } from '@/models/Project'
import { Topic } from '@/models/Topic'
import { TopicHandler } from '@/models/TopicHandler'
import Modal from '@/components/ui/modal'
import TopicDetailView from '@/components/views/TopicDetailView'

interface TopicTabProps {
  project: Project
}

const TopicTab: React.FC<TopicTabProps> = ({ project }) => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null)
  const [chats] = useState([])
  const [activeChat, setActiveChat] = useState<null>(null)
  const [markdown, setMarkdown] = useState('')
  const topicHandler = React.useMemo(() => TopicHandler.getInstance(), [])

  useEffect(() => {
    topicHandler
      .getTopicsForProject(project.id)
      .then(setTopics)
      .catch(() => setTopics([]))
  }, [project.id, topicHandler])


  const openTopic = async (topic: Topic) => {
    setActiveTopic(topic)
    const md = await topicHandler.getMarkdownForTopic(
      topic.project.goal.id,
      topic.project.id,
      topic.id
    )
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
          chats={[]}
          onBack={() => {
            setActiveTopic(null)
            setMarkdown('')
          }}
          onOpenChat={() => {}}
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

      {false && (
        <Modal isOpen={!!activeChat} onClose={() => setActiveChat(null)} title="">
          <ChatView chat={activeChat as any} />
        </Modal>
      )}
    </div>
  )
}

export default TopicTab
