import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  onClick?: () => void;
}

export function StatsCard({ title, value, icon: Icon, onClick }: StatsCardProps) {
  return (
    <div
      className="flex items-center justify-between p-4 bg-white rounded shadow hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
  );
}
