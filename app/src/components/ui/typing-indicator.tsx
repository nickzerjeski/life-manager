import React from 'react'

const TypingIndicator: React.FC = () => (
  <div className="flex space-x-1">
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-dot-bounce" />
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-dot-bounce [animation-delay:.2s]" />
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-dot-bounce [animation-delay:.4s]" />
  </div>
)

export default TypingIndicator
