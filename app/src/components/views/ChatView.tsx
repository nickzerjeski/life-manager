import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import axios from 'axios'
import { XCircle } from 'lucide-react'
import { Chat, ChatMessage } from '@/models/Chat'
import ChatBubble from '@/components/ui/chat-bubble'
import CleanChatBubble from '@/components/ui/clean-chat-bubble'
import ChatTextField from '../ui/chat-text-field'
import TypingIndicator from '../ui/typing-indicator'

interface ChatViewProps {
  chat?: Chat
  goalId?: string
  projectId?: string
}

const ChatView: React.FC<ChatViewProps> = ({ chat, goalId, projectId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(chat?.messages ?? [])
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef<string>(crypto.randomUUID())

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { sender: 'user', text }])
    setIsLoading(true)
    const url = import.meta.env.VITE_RAG_AGENT_WEBHOOK
    if (!url) {
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: 'RAG agent webhook not configured.' },
      ])
      setIsLoading(false)
      return
    }
    try {
      const payload: Record<string, string> = {
        session_id: sessionIdRef.current,
        chat_input: text,
      }
      if (goalId) payload.goal_id = goalId
      if (projectId) payload.project_id = projectId
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      const answer =
        response.data?.output ||
        response.data?.text ||
        response.data?.answer ||
        response.data?.message ||
        (typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data))
      setMessages(prev => [...prev, { sender: 'assistant', text: answer }])
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err)
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Failed to get a response',
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if ((window as any).MathJax?.typeset) {
      ;(window as any).MathJax.typeset()
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex flex-col flex-grow space-y-2 text-sm overflow-y-auto mb-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'user' ? (
              <ChatBubble>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: (props) => (
                      <table className="min-w-full border border-gray-300 text-sm" {...props} />
                    ),
                    th: (props) => (
                      <th className="border px-2 py-1 bg-gray-100 text-left" {...props} />
                    ),
                    td: (props) => (
                      <td className="border px-2 py-1" {...props} />
                    ),
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </ChatBubble>
            ) : (
              <CleanChatBubble>
                {m.isError ? (
                  <div className="flex items-center gap-2 rounded-3xl bg-red-50 border border-red-200 text-red-800 p-2">
                    <XCircle className="w-4 h-4" />
                    <span>{m.text}</span>
                  </div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: (props) => (
                        <table className="min-w-full border border-gray-300 text-sm" {...props} />
                      ),
                      th: (props) => (
                        <th className="border px-2 py-1 bg-gray-100 text-left" {...props} />
                      ),
                      td: (props) => (
                        <td className="border px-2 py-1" {...props} />
                      ),
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                )}
              </CleanChatBubble>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <CleanChatBubble>
              <TypingIndicator />
            </CleanChatBubble>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="sticky bottom-0 bg-white pt-2">
        <ChatTextField onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default ChatView

