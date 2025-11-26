import React from 'react';
import clsx from 'clsx';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange';
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white/80 backdrop-blur-apple rounded-3xl p-6 shadow-apple border border-white/20 hover:shadow-apple-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
          <p className="text-4xl font-semibold text-gray-900 mb-1">{value}</p>
        </div>
        
        <div
          className={clsx(
            'w-14 h-14 rounded-2xl flex items-center justify-center shadow-apple',
            `bg-gradient-to-br ${colorClasses[color]}`
          )}
        >
          <div className="w-7 h-7 text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
}