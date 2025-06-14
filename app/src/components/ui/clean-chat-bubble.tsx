import React from 'react';

interface CleanChatBubbleProps {
  children: React.ReactNode;
}

const CleanChatBubble: React.FC<CleanChatBubbleProps> = ({ children }) => {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex flex-col w-full max-w-[320px] leading-1.5">
        <div className="prose max-w-none text-sm py-2 text-gray-900 dark:text-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CleanChatBubble;
