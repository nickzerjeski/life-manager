import React from 'react'
import { Chat } from '@shared/models/Chat'
import ChatBubble from '@/components/ui/chat-bubble'
import CleanChatBubble from '@/components/ui/clean-chat-bubble'

interface ChatViewProps {
  chat: Chat
}

const ChatView: React.FC<ChatViewProps> = ({ chat }) => {
  return (
    <div className="space-y-2 text-sm">
      {chat.messages.map((m, idx) => (
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
    </div>
  )
}

export default ChatView
