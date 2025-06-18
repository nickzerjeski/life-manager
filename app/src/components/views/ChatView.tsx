import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Chat, ChatMessage } from '@/models/Chat'
import ChatBubble from '@/components/ui/chat-bubble'
import CleanChatBubble from '@/components/ui/clean-chat-bubble'
import ChatTextField from '../ui/chat-text-field'

interface ChatViewProps {
  chat: Chat
}

const ChatView: React.FC<ChatViewProps> = ({ chat }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(chat.messages)
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (text: string) => {
    if (!text.trim()) return
    setMessages(prev => [
      ...prev,
      { sender: 'user', text },
      {
        sender: 'assistant',
        text:
          'This is $a^2+b^2=c^2$ a inline equation $$ \\int_a^b f(x)\\,dx = F(b) - F(a) $$\n\n| Name     | Age | Occupation   |\n|----------|-----|--------------|\n| Alice    | 30  | Engineer     |\n| Bob      | 25  | Designer     |\n| Charlie  | 35  | Manager      |',
      },
    ])
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
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                  table: ({ node, ...props }) => (
                    <table className="min-w-full border border-gray-300 text-sm" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border px-2 py-1 bg-gray-100 text-left" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border px-2 py-1" {...props} />
                  ),
                }}>
                  {m.text}
                </ReactMarkdown>
              </ChatBubble>
            ) : (
              <CleanChatBubble>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                  table: ({ node, ...props }) => (
                    <table className="min-w-full border border-gray-300 text-sm" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border px-2 py-1 bg-gray-100 text-left" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border px-2 py-1" {...props} />
                  ),
                }}>
                  {m.text}
                </ReactMarkdown>
              </CleanChatBubble>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="sticky bottom-0 bg-white pt-2">
        <ChatTextField onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default ChatView
