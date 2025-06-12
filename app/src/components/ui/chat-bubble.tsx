import React from 'react';

interface ChatBubbleProps {
  children: React.ReactNode;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ children }) => {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex flex-col gap-1 w-full max-w-[320px]">
        <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-700">
          <p className="text-sm font-normal text-gray-900 dark:text-white">{children}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
