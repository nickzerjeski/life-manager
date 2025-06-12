'use client';

import React from 'react';

interface WalletOption {
  name: string;
  icon: React.ReactNode;
  badge?: string;
}

interface FolderModalProps {
  open: boolean;
  onClose: () => void;
  items: WalletOption[];
}

const FolderModal: React.FC<FolderModalProps> = ({ open, onClose, items }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connect wallet
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4">
              Connect with one of our available wallet providers or create a new one.
            </p>
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    {item.icon}
                    <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded-sm dark:bg-gray-700 dark:text-gray-400">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <a
                href="#"
                className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
              >
                <svg className="w-3 h-3 me-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Why do I need to connect with my wallet?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderModal;