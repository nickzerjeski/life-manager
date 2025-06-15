import { Button } from "@/components/ui/button";
import { SpeedDial } from "@/components/ui/speed-dial";
import FolderModal from "@/modals/FolderModal";
import { useState } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;

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
        <SpeedDial />
        <Button onClick={() => console.log(supabaseUrl)} className="w-full">

        </Button>
      </section>

      <FolderModal open={modalOpen} onClose={() => setModalOpen(false)} items={mockData} />
    </>
  );
}