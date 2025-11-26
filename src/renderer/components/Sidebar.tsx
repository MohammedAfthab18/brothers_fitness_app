import React from 'react';
import { LayoutDashboard, Users, Settings, Dumbbell } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  view: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all',
        active
          ? 'bg-apple-blue text-white shadow-apple'
          : 'text-gray-600 hover:bg-white/50'
      )}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', view: 'dashboard' },
    { icon: <Users />, label: 'Members', view: 'members' },
    { icon: <Settings />, label: 'Settings', view: 'settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-white/70 backdrop-blur-apple border-r border-gray-200/50 flex flex-col p-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-apple-blue rounded-2xl flex items-center justify-center shadow-apple">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Brothers</h1>
            <p className="text-xs text-gray-500">Fitness</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            view={item.view}
            active={currentView === item.view}
            onClick={() => onNavigate(item.view)}
          />
        ))}
      </nav>

      {/* User Info */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4">
          <div className="w-10 h-10 bg-gradient-to-br from-apple-blue to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}