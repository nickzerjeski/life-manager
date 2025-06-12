import { SendHorizontal } from 'lucide-react';
import React, { useState } from 'react';

interface ChatTextFieldProps {
  onSubmit?: (text: string) => void;
}

const ChatTextField: React.FC<ChatTextFieldProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setText('');
  };

  return (
    <div className="w-full mb-2 border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div className="px-4 py-0 bg-white rounded-t-xl dark:bg-gray-800">
        <label htmlFor="comment" className="sr-only">Your comment</label>
        <textarea
          id="comment"
          rows={0}
          className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 resize-none"
          placeholder="Ask anything"
          required
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between px-3 py-1 bg-white rounded-b-xl dark:bg-gray-800">
        <div className="flex space-x-1 rtl:space-x-reverse">
          <button type="button" className="p-2 text-gray-500 rounded-sm hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg className="w-4 h-4" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6" />
            </svg>
            <span className="sr-only">Attach file</span>
          </button>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatTextField;
