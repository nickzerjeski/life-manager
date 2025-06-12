import FolderModal from "@/modal/FolderModal";
import { useState } from "react";

export default function HabitPage() {
    const [modalOpen, setModalOpen] = useState(false);

  const mockData = [
    {
      name: 'Mock Wallet A',
      icon: <div className="h-5 w-5 bg-blue-500 rounded" />,
      badge: 'Mock',
    },
    {
      name: 'Mock Wallet B',
      icon: <div className="h-5 w-5 bg-green-500 rounded" />,
    },
  ];

  return (
    <>
      <section className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-2">
        <div
          onClick={() => setModalOpen(true)}
          className="cursor-pointer border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          Open Wallet Modal
        </div>
      </section>

      <FolderModal open={modalOpen} onClose={() => setModalOpen(false)} items={mockData} />
    </>
  );
}