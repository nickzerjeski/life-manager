import React, { useState } from 'react'
import { Chat, ChatMessage } from '@shared/models/Chat'
import ChatBubble from '@/components/ui/chat-bubble'
import CleanChatBubble from '@/components/ui/clean-chat-bubble'
import ChatTextField from '../ui/chat-text-field'

interface ChatViewProps {
  chat: Chat
}

const ChatView: React.FC<ChatViewProps> = ({ chat }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(chat.messages)

  const handleSubmit = (text: string) => {
    if (!text.trim()) return
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text },
      { sender: 'assistant', text: 'Lorem ipsum dolor sit amet.' },
    ])
  }

  return (
    <div className="space-y-2 text-sm">
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
      <ChatTextField onSubmit={handleSubmit} />
    </div>
  )
}

export default ChatView
