import React, { useState, useRef, useEffect } from 'react'
import { Chat, ChatMessage } from '@shared/models/Chat'
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
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text },
      { sender: 'assistant', text: 'Lorem ipsum dolor sit amet.' },
    ])
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
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
              <ChatBubble>{m.text}</ChatBubble>
            ) : (
              <CleanChatBubble>{m.text}</CleanChatBubble>
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
